require 'pathname'
require 'sprockets'

root        = Pathname(File.expand_path('../', __FILE__))
environment = Sprockets::Environment.new(root)
environment.append_path(root.join('src'))

task :build do
  File.open('lib/colorcanvas.js', 'w+') do |f|
    f.write environment['colorcanvas'].to_s
  end

  `uglifyjs lib/colorcanvas.js > lib/colorcanvas.min.js`
end