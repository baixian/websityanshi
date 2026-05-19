module.exports = {
    map: false,
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('postcss-preset-env')({
            stage: 0,
            preserve: false
        })
    ]
}
