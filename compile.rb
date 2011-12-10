require 'rubygems'
require 'coffee-script'
require 'json'

files = ['kart']
standard_js = ''
files.each do |file|
  standard_js << CoffeeScript.compile(File.read("./#{file}.coffee"), :bare => true, :no_wrap => true)
  standard_js << "\n"
end

puts "written to app.js"
File.open("./app.js", 'w') {|f| f.write(standard_js) }
