require_relative 'Plugin'
require 'net/http'
require 'json'
require 'uri'
require 'fileutils'

class GithubRepoStarsCountPlugin < Plugin
  CACHE_FILE = './.github_stars_cache.json'
  CACHE_TTL = 86400 # 24 hours in seconds

  attr_reader :data, :repos

  def initialize(data)
    @data = data
    repos = {}
    data[0].each do |repo|
      repos[repo] = nil
    end
    @repos = repos
  end

  def execute
    cached = load_cache

    repos.each do |repo, _|
      # Use cached value if fresh
      if cached[repo] && cached[repo]['timestamp'] &&
         (Time.now.to_i - cached[repo]['timestamp']) < CACHE_TTL
        repos[repo] = cached[repo]['stars']
      else
        repos[repo] = fetch_stars_from_api(repo)
      end
    end

    save_cache(repos)
    repos
  end

  private

  def fetch_stars_from_api(repo, redirect_count = 0)
    return nil if redirect_count > 3

    uri = URI("https://api.github.com/repos/#{repo}")

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 5
    http.read_timeout = 5

    request = Net::HTTP::Get.new(uri)
    request['Accept'] = 'application/vnd.github.v3+json'
    request['User-Agent'] = 'jeremylongshore-portfolio'

    # Use GITHUB_TOKEN if available for higher rate limits
    github_token = ENV['GITHUB_TOKEN']
    if github_token && !github_token.empty?
      request['Authorization'] = "token #{github_token}"
    end

    begin
      response = http.request(request)

      case response.code.to_i
      when 200
        data = JSON.parse(response.body)
        data['stargazers_count']
      when 301, 302, 307, 308
        # Follow redirect
        location = response['location']
        if location
          redirect_uri = URI(location)
          return fetch_stars_from_redirect(redirect_uri, redirect_count + 1)
        end
        nil
      when 404
        # Repo not found or private
        nil
      when 403
        # Rate limited - try to use cached value
        STDERR.puts "Rate limited for #{repo}, using cached value"
        load_cache.dig(repo, 'stars')
      else
        STDERR.puts "GitHub API error for #{repo}: #{response.code}"
        nil
      end
    rescue StandardError => e
      STDERR.puts "Error fetching stars for #{repo}: #{e.message}"
      # On error, try to return cached value
      load_cache.dig(repo, 'stars')
    end
  end

  def fetch_stars_from_redirect(uri, redirect_count = 0)
    return nil if redirect_count > 3

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 5
    http.read_timeout = 5

    request = Net::HTTP::Get.new(uri)
    request['Accept'] = 'application/vnd.github.v3+json'
    request['User-Agent'] = 'jeremylongshore-portfolio'

    github_token = ENV['GITHUB_TOKEN']
    if github_token && !github_token.empty?
      request['Authorization'] = "token #{github_token}"
    end

    begin
      response = http.request(request)

      case response.code.to_i
      when 200
        data = JSON.parse(response.body)
        data['stargazers_count']
      when 301, 302, 307, 308
        location = response['location']
        if location
          redirect_uri = URI(location)
          return fetch_stars_from_redirect(redirect_uri, redirect_count + 1)
        end
        nil
      else
        nil
      end
    rescue StandardError => e
      nil
    end
  end

  def load_cache
    return {} unless File.exist?(CACHE_FILE)

    begin
      JSON.parse(File.read(CACHE_FILE))
    rescue JSON::ParserError
      {}
    end
  end

  def save_cache(repos)
    cache_data = {}
    repos.each do |repo, stars|
      cache_data[repo] = {
        'stars' => stars,
        'timestamp' => Time.now.to_i
      }
    end

    File.write(CACHE_FILE, JSON.pretty_generate(cache_data))
  rescue StandardError => e
    STDERR.puts "Error saving cache: #{e.message}"
  end
end
