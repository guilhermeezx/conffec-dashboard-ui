
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				'satoshi': ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				// Sistema Conffec - Cores oficiais
				primary: {
					DEFAULT: '#00D084', // Verde claro
					foreground: '#FFFFFF',
					dark: '#00664F', // Verde petróleo
				},
				secondary: {
					DEFAULT: '#3B82F6', // Azul para botões secundários
					foreground: '#FFFFFF'
				},
				success: '#00D084',
				warning: '#F59E0B',
				error: '#EF4444',
				
				// Sistema de cores base
				background: '#FFFFFF',
				foreground: '#1F2937',
				muted: {
					DEFAULT: '#F5F7FA',
					foreground: '#6B7280'
				},
				accent: {
					DEFAULT: '#E0FDF2', // Verde pálido para seleção
					foreground: '#00664F'
				},
				border: '#E5E7EB',
				input: '#E5E7EB',
				ring: '#00D084',
				
				// Cores específicas do sistema
				conffec: {
					green: '#00D084',
					'green-dark': '#00664F',
					'green-light': '#E0FDF2',
					blue: '#3B82F6',
					gray: {
						50: '#F5F7FA',
						100: '#E5E7EB',
						600: '#6B7280',
						900: '#1F2937'
					}
				},
				
				// Mantendo compatibilidade com shadcn
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937'
				},
				destructive: {
					DEFAULT: '#EF4444',
					foreground: '#FFFFFF'
				},
				sidebar: {
					DEFAULT: '#FFFFFF',
					foreground: '#1F2937',
					primary: '#00D084',
					'primary-foreground': '#FFFFFF',
					accent: '#E0FDF2',
					'accent-foreground': '#00664F',
					border: '#E5E7EB',
					ring: '#00D084'
				}
			},
			borderRadius: {
				lg: '12px', // Seguindo o padrão da referência
				md: '8px',
				sm: '6px'
			},
			boxShadow: {
				'conffec': '0px 2px 6px rgba(0,0,0,0.06)', // Sombra suave conforme especificação
				'conffec-lg': '0px 4px 12px rgba(0,0,0,0.08)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
