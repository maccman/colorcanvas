require 'pathname'
require 'sprockets'

root        = Pathname(File.expand_path('../', __FILE__))
environment = Sprockets::Environment.new(root)
environment.append_path(root.join('src'))

class Sprockets::JstProcessor
  def self.default_namespace
    'this.ColorCanvas'
  end
end

task :build do
  File.open('lib/colorcanvas.js', 'w+') do |f|
    f.write environment['index'].to_s
  end

  File.open('lib/colorcanvas.input.js', 'w+') do |f|
    f.write environment['input'].to_s
  end

  `uglifyjs lib/colorcanvas.js > lib/colorcanvas.min.js`
  `uglifyjs lib/colorcanvas.input.js > lib/colorcanvas.input.min.js`
end