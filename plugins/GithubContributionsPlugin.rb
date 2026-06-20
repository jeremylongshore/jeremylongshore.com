require_relative 'Plugin'
require 'net/http'
require 'json'
require 'uri'
require 'fileutils'

# Pulls Jeremy's merged PRs to EXTERNAL repos (not his own orgs) live from the
# GitHub search API. Replaces the old hand-maintained contributions block in
# config.yml. Curated metadata (label/description/icon/tags) is layered on top
# of the live counts for notable repos; everything else renders as a chip.
class GithubContributionsPlugin < Plugin
  CACHE_FILE = './.github_contributions_cache.json'
  CACHE_TTL = 21600 # 6 hours
  AUTHOR = 'jeremylongshore'
  EXCLUDE_OWNERS = %w[jeremylongshore intent-solutions-io intent-solutions]

  # Curated presentation for notable external repos. Live count is always real.
  META = {
    'GoogleCloudPlatform/vertex-ai-samples' => { 'label' => 'Vertex AI Samples', 'description' => 'ADK inline-source deployment tutorial for Agent Engine', 'icon' => 'fa-brands fa-google', 'tags' => %w[Python Vertex-AI ADK] },
    'GoogleCloudPlatform/agent-starter-pack' => { 'label' => 'Agent Starter Pack', 'description' => "Bob's Brain production ADK reference in the community showcase", 'icon' => 'fa-brands fa-google', 'tags' => %w[Docs ADK] },
    'PostHog/posthog' => { 'label' => 'PostHog', 'description' => 'React state management and feature-flag bug fixes', 'icon' => 'fa-solid fa-chart-simple', 'tags' => %w[TypeScript React] },
    'gastownhall/beads' => { 'label' => 'Beads', 'description' => 'Natural-language skill activation and core fixes', 'icon' => 'fa-solid fa-link', 'tags' => %w[Go Claude-Code] },
    'pabs-ai/blur-extension' => { 'label' => 'Blur Extension', 'description' => 'Teams, Slack, export/import, custom patterns', 'icon' => 'fa-solid fa-eye-slash', 'tags' => %w[JavaScript Privacy] },
    'kobiton/automate' => { 'label' => 'Kobiton Automate', 'description' => 'Mobile device-cloud test automation contributions', 'icon' => 'fa-solid fa-mobile-screen', 'tags' => %w[Automation Testing] },
    'Kilo-Org/kilocode' => { 'label' => 'Kilo Code', 'description' => 'Agent runtime test fix', 'icon' => 'fa-solid fa-robot', 'tags' => %w[TypeScript] },
    'tldraw/tldraw' => { 'label' => 'tldraw', 'description' => 'Prettier extension fix', 'icon' => 'fa-solid fa-pen-ruler', 'tags' => %w[TypeScript] },
    'filamentphp/filament' => { 'label' => 'Filament', 'description' => 'Dark mode fix', 'icon' => 'fa-solid fa-layer-group', 'tags' => %w[PHP Laravel] }
  }.freeze

  def initialize(data = [])
    @data = data
  end

  def execute
    cached = load_cache
    if cached && cached['timestamp'] && (Time.now.to_i - cached['timestamp']) < CACHE_TTL
      return cached['result']
    end

    result = fetch_contributions
    if result && result['total_prs'].to_i > 0
      save_cache(result)
      result
    else
      # On failure, fall back to last good cache (even if stale)
      cached ? cached['result'] : empty_result
    end
  end

  private

  def query
    excludes = EXCLUDE_OWNERS.map { |o| "-user:#{o}" }.join(' ')
    "author:#{AUTHOR} type:pr is:merged #{excludes}"
  end

  def fetch_contributions
    uri = URI('https://api.github.com/search/issues')
    uri.query = URI.encode_www_form(q: query, per_page: 100, sort: 'created', order: 'desc')

    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 8
    http.read_timeout = 8

    request = Net::HTTP::Get.new(uri)
    request['Accept'] = 'application/vnd.github.v3+json'
    request['User-Agent'] = 'jeremylongshore-portfolio'
    token = ENV['GITHUB_TOKEN'] || ENV['GH_TOKEN']
    request['Authorization'] = "token #{token}" if token && !token.empty?

    response = http.request(request)
    unless response.code.to_i == 200
      STDERR.puts "Contributions API error: #{response.code} #{response.body[0..160]}"
      return nil
    end

    body = JSON.parse(response.body)
    total = body['total_count'].to_i
    items = body['items'] || []

    counts = Hash.new(0)
    items.each do |it|
      repo = (it['repository_url'] || '').sub('https://api.github.com/repos/', '')
      next if repo.empty?
      counts[repo] += 1
    end

    highlights = []
    others = []
    counts.sort_by { |_, c| -c }.each do |repo, count|
      pulls_url = "https://github.com/#{repo}/pulls?q=#{URI.encode_www_form_component("is:pr author:#{AUTHOR} is:merged")}"
      if META.key?(repo)
        highlights << META[repo].merge('repo' => repo, 'count' => count, 'url' => pulls_url)
      else
        others << { 'repo' => repo, 'name' => repo.split('/').last, 'count' => count, 'url' => pulls_url }
      end
    end

    {
      'total_prs' => total,
      'total_repos' => counts.keys.size,
      'highlights' => highlights,
      'others' => others
    }
  rescue StandardError => e
    STDERR.puts "Error fetching contributions: #{e.message}"
    nil
  end

  def empty_result
    { 'total_prs' => 0, 'total_repos' => 0, 'highlights' => [], 'others' => [] }
  end

  def load_cache
    return nil unless File.exist?(CACHE_FILE)
    JSON.parse(File.read(CACHE_FILE))
  rescue JSON::ParserError
    nil
  end

  def save_cache(result)
    File.write(CACHE_FILE, JSON.pretty_generate('timestamp' => Time.now.to_i, 'result' => result))
  rescue StandardError => e
    STDERR.puts "Error saving contributions cache: #{e.message}"
  end
end
