# icon2font
icon2font is a simple tool to convert svg icon to multiple formats of fonts, include eot/ttf/woff.

## Install: 
`npm install icon2font`

## Usage:
1. use it with guide(it will show you how to use step by step):
`icon2font start`

2. use it by command(recommend use this when you have already know the parameters):
`icon2font -i <input icon direction> -o <output font direction> -n <your font name>`

#### Parameter introduction:
1. -i input icon file direction
2. -o output font file direction
3. -n convert font name

#### Use it in your project:
1. `<i class='change-icon-[type]' />`
  > the content of type is the same name of your svg which you want to use

2. import iconfont-list.css/.less in your page
  > you can find these two file in your output file

## See the result:
You can see the font created example by opening the 'index.html' under your output file.
