require_relative 'Plugin'
require 'net/http'
require 'uri'
require 'rexml/document'
require 'json'
require 'fileutils'

class StartAIToolsRSSPlugin < Plugin
  CACHE_FILE = './.rss_cache.json'
  CACHE_TTL = 3600 # 1 hour in seconds
  RSS_URL = 'https://startaitools.com/index.xml'
  MAX_POSTS = 6

  def initialize(data)
    @data = data
    @max_posts = (data && data[0].is_a?(Integer) ? data[0] : MAX_POSTS)
  end

  def execute
    cached = load_cache
    if cached && cached['timestamp'] && (Time.now.to_i - cached['timestamp']) < CACHE_TTL
      return cached['posts']
    end

    posts = fetch_rss
    save_cache(posts) if posts && posts.any?
    posts || []
  end

  private

  def fetch_rss
    uri = URI(RSS_URL)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = true
    http.open_timeout = 10
    http.read_timeout = 10

    request = Net::HTTP::Get.new(uri)
    request['User-Agent'] = 'jeremylongshore-portfolio'

    begin
      response = http.request(request)

      if response.code.to_i == 200
        parse_rss(response.body)
      else
        STDERR.puts "RSS fetch error: #{response.code}"
        load_cache_posts
      end
    rescue StandardError => e
      STDERR.puts "Error fetching RSS: #{e.message}"
      load_cache_posts
    end
  end

  def parse_rss(xml_body)
    doc = REXML::Document.new(xml_body)
    posts = []

    doc.elements.each('rss/channel/item') do |item|
      break if posts.length >= @max_posts

      title = item.elements['title']&.text
      link = item.elements['link']&.text
      pub_date = item.elements['pubDate']&.text
      description = item.elements['description']&.text

      next unless title && link
      next unless link.include?('/posts/')  # Only blog posts, skip pages

      # Parse date
      date_str = ''
      if pub_date
        begin
          parsed = Time.parse(pub_date)
          date_str = parsed.strftime('%b %d, %Y')
        rescue
          date_str = pub_date
        end
      end

      # Strip HTML from description and truncate
      clean_desc = (description || '').gsub(/<[^>]+>/, '').strip
      clean_desc = clean_desc[0..140] + '...' if clean_desc.length > 140

      posts << {
        'title' => title,
        'url' => link,
        'date' => date_str,
        'description' => clean_desc
      }
    end

    posts
  end

  def load_cache
    return nil unless File.exist?(CACHE_FILE)
    JSON.parse(File.read(CACHE_FILE))
  rescue JSON::ParserError
    nil
  end

  def load_cache_posts
    cached = load_cache
    cached ? cached['posts'] : []
  end

  def save_cache(posts)
    cache_data = {
      'timestamp' => Time.now.to_i,
      'posts' => posts
    }
    File.write(CACHE_FILE, JSON.pretty_generate(cache_data))
  rescue StandardError => e
    STDERR.puts "Error saving RSS cache: #{e.message}"
  end
end
