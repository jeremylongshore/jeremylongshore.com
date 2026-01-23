require 'fileutils'
require 'liquid'
require 'yaml'

if File.exist?("config.yml")
    config = YAML.load_file("config.yml")
else
    raise "Error: config.yml not found."
end

settings = YAML.load_file("config.yml") || {}

# Load projects from data file
projects_file = "./data/projects.yml"
if File.exist?(projects_file)
  projects_data = YAML.load_file(projects_file)
  settings["intent_solutions_repos"] = projects_data["intent_solutions_repos"] || []
  settings["products"] = projects_data["products"] || []
  settings["personal_repos"] = projects_data["personal_repos"] || []
  settings["client_projects"] = projects_data["client_projects"] || []
  settings["n8n_workflows"] = projects_data["n8n_workflows"] || []
  # Legacy support
  settings["projects"] = projects_data["projects"] || []
else
  puts "Warning: #{projects_file} not found. Using empty projects list."
  settings["intent_solutions_repos"] = []
  settings["products"] = []
  settings["personal_repos"] = []
  settings["client_projects"] = []
  settings["n8n_workflows"] = []
  settings["projects"] = []
end

# Collect GitHub repos from all projects for star fetching
all_projects = settings["intent_solutions_repos"] + settings["products"] + settings["personal_repos"] + settings["client_projects"] + settings["n8n_workflows"]
github_repos = all_projects
  .map { |p| p["github_repo"] }
  .compact
  .uniq

source_dir = "./themes/#{settings["theme"] || "default"}"
destination_dir = "./_output/"

# Clean _output folder
if Dir.exist?(destination_dir)
    Dir.foreach(destination_dir) do |file|
        next if file == '.' || file == '..' || file == 'AUTO_GEN_FOLDER_DO_NOT_EDIT_FILE_HERE'
        file_path = File.join(destination_dir, file)

        if File.file?(file_path)
            FileUtils.rm(file_path)
        end
    end
else
    FileUtils.mkdir_p(destination_dir)
end

# Copy all files and directories while preserving the structure
Dir.glob("#{source_dir}/**/*").each do |entry|
  relative_path = entry.sub("#{source_dir}/", '')

  new_location = File.join(destination_dir, relative_path)

  if File.directory?(entry)
    FileUtils.mkdir_p(new_location)
  else
    FileUtils.cp(entry, new_location)
  end
end


template_file = "#{destination_dir}/index.html"
if !File.exist?(template_file)
    raise "Error: #{template_file} file not found."
end


template_content = File.read(template_file)

# Initialize vars for plugins
settings["vars"] = {}

# Run GithubRepoStarsCountPlugin for project repos
if github_repos.any?
  if File.exist?("./plugins/GithubRepoStarsCountPlugin.rb")
    require_relative "./plugins/GithubRepoStarsCountPlugin.rb"
    plugin_data = [github_repos]
    plugin = GithubRepoStarsCountPlugin.new(plugin_data)
    settings["github_stars"] = plugin.execute()
    settings["vars"]["GithubRepoStarsCountPlugin"] = settings["github_stars"]
  end
end

# Run any additional plugins from config
if !settings["plugins"].nil?
  settings["plugins"].each do |plugin|
    pluginFileName = plugin.keys[0]
    if File.exist?("./plugins/#{pluginFileName}.rb")
      require_relative "./plugins/#{pluginFileName}.rb"
      pluginObject = Object.const_get(pluginFileName).new(plugin.values)
      result = pluginObject.execute()
      settings["vars"][pluginFileName] = result
      # Merge stars into github_stars if this is the stars plugin
      if pluginFileName == "GithubRepoStarsCountPlugin" && result.is_a?(Hash)
        settings["github_stars"] ||= {}
        settings["github_stars"].merge!(result)
      end
    end
  end
end


if !settings["links"].nil?
  settings["links"].each_with_index do |link, index|
    settings["links"][index]["link"]["icon"] = Liquid::Template.parse(settings["links"][index]["link"]["icon"]).render(settings)
    settings["links"][index]["link"]["url"] = Liquid::Template.parse(settings["links"][index]["link"]["url"]).render(settings)
    settings["links"][index]["link"]["alt"] = Liquid::Template.parse(settings["links"][index]["link"]["alt"]).render(settings)
    settings["links"][index]["link"]["title"] = Liquid::Template.parse(settings["links"][index]["link"]["title"]).render(settings)
    settings["links"][index]["link"]["text"] = Liquid::Template.parse(settings["links"][index]["link"]["text"]).render(settings)
  end
end

if !settings["socials"].nil?
  settings["socials"].each_with_index do |link, index|
    settings["socials"][index]["social"]["icon"] = Liquid::Template.parse(settings["socials"][index]["social"]["icon"]).render(settings)
    settings["socials"][index]["social"]["url"] = Liquid::Template.parse(settings["socials"][index]["social"]["url"]).render(settings)
    settings["socials"][index]["social"]["alt"] = Liquid::Template.parse(settings["socials"][index]["social"]["alt"]).render(settings)
    settings["socials"][index]["social"]["title"] = Liquid::Template.parse(settings["socials"][index]["social"]["title"]).render(settings)
  end
end

settings["title"] = Liquid::Template.parse(settings["title"]).render(settings)
settings["footer"] = Liquid::Template.parse(settings["footer"]).render(settings)
settings["tagline"] = Liquid::Template.parse(settings["tagline"]).render(settings)
settings["name"] = Liquid::Template.parse(settings["name"]).render(settings)
settings["last_modified_at"] = Time.now.strftime("%Y-%m-%dT%H:%M:%S%z")

# Parse the Liquid template
liquid_template = Liquid::Template.parse(template_content)

rendered_content = liquid_template.render(settings)

File.open(template_file, 'w') do |file|
  file.write(rendered_content)
end
