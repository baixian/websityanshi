module.exports = {
    content: [
        './src/pages/**/*.html',
        './src/pages/**/*.js'
    ],
    corePlugins: {
        preflight: false
    },
    theme: {
        extend: {
            colors: {
                pf: {
                    bg: '#0b1224',
                    surface: '#0f172a',
                    surfaceSoft: '#111827',
                    line: 'rgba(255,255,255,0.12)',
                    text: '#e5e7eb',
                    muted: '#cbd5e1',
                    indigo: '#6366f1',
                    indigoDeep: '#4f46e5',
                    electric: '#1d4ed8',
                    cyan: '#0ea5e9',
                    aqua: '#22d3ee',
                    pink: '#f472b6',
                    amber: '#f59e0b'
                }
            },
            fontFamily: {
                display: ['DIN Alternate', 'Avenir Next Condensed', 'PingFang SC', 'sans-serif'],
                body: ['Avenir Next', 'PingFang SC', 'Microsoft YaHei', 'sans-serif']
            },
            boxShadow: {
                'pf-glow': '0 24px 90px rgba(2, 6, 23, 0.5)',
                'pf-indigo': '0 18px 60px rgba(79, 70, 229, 0.35)',
                'pf-cyan': '0 18px 70px rgba(14, 165, 233, 0.22)'
            },
            backgroundImage: {
                'pf-grid': 'linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)'
            }
        }
    },
    plugins: []
}
