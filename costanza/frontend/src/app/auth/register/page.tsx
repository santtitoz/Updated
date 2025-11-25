'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Github } from 'lucide-react'
// Não precisamos do useAuth aqui, pois o registro apenas redireciona para o login.

export default function RegisterPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (formData.password.length < 8) {
            setError('A senha deve ter pelo menos 8 caracteres')
            return
        }

        setLoading(true)

        try {
            // 🚨 CORREÇÃO: Usamos o endpoint padrão do Djoser para Registro
            const response = await fetch(`${API_URL}/api/auth/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // Djoser espera 'email' e 'password'
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            })

            if (response.ok) {
                // Registro bem-sucedido: Redireciona o usuário para fazer login
                alert('Conta criada com sucesso! Faça login para continuar.');
                router.push('/auth/login'); 
                
            } else {
                const data = await response.json()
                // Tenta exibir a mensagem de erro específica do Django
                if (data.email) {
                    setError(`Email: ${data.email.join(' ')}`);
                } else if (data.password) {
                    setError(`Senha: ${data.password.join(' ')}`);
                } else {
                    setError(data.detail || 'Erro ao criar conta. Verifique os dados.');
                }
            }
        } catch (err) {
            setError('Erro ao conectar com o servidor. Verifique se o Django está ativo (porta 8000).');
        } finally {
            setLoading(false);
        }
    }

    const handleSocialLogin = (provider: 'google' | 'github') => {
        // Redireciona o usuário para o endpoint inicial do OAuth do Django/Djoser
        // Ex: http://localhost:8000/api/auth/o/google-oauth2/
        window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/o/${provider}-oauth2/`
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    {/* Left Side - Decorative */}
                    <div>
                        <h1 className="text-5xl font-bold mb-4 text-black">
                            Como se estivesse
                        </h1>
                        <h2 className="text-5xl font-bold text-[#d946ef]">Jogando</h2>
                        
                        <div className="relative mt-16 h-96">
                            {/* SVG de Ilhas/Mundo */}
                            <div className="absolute left-0 top-16 w-80 h-80 bg-purple-500/5 rounded-3xl"></div>
                            <div className="absolute left-8 top-24 w-28 h-28 bg-gradient-to-br from-[#a855f7] to-[#9333ea] rounded-3xl shadow-xl z-10"></div>
                            <div className="absolute left-52 top-8 w-24 h-24 bg-gradient-to-br from-[#ec4899] to-[#db2777] rounded-3xl shadow-xl z-10"></div>
                            <div className="absolute left-32 bottom-8 w-28 h-28 bg-gradient-to-br from-[#f87171] to-[#ef4444] rounded-3xl shadow-xl z-10"></div>
                            
                            {/* Linhas de conexão */}
                            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" style={{ overflow: 'visible' }}>
                                <path 
                                    d="M 70 150 Q 120 90 220 70" 
                                    stroke="#94a3b8" 
                                    strokeWidth="2.5" 
                                    strokeDasharray="8,6" 
                                    strokeLinecap="round"
                                    fill="none" 
                                />
                                <path 
                                    d="M 70 180 Q 100 240 160 300" 
                                    stroke="#94a3b8" 
                                    strokeWidth="2.5" 
                                    strokeDasharray="8,6"
                                    strokeLinecap="round"
                                    fill="none" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Right Side - Register Form */}
                    <div className="bg-gray-50 rounded-3xl p-8 shadow-sm">
                        <div className="mb-8">
                            <h3 className="text-3xl font-bold font-pixel">
                                <span className="bg-gradient-to-r from-[#d946ef] via-[#ec4899] to-[#a855f7] bg-clip-text text-transparent">
                                    Costanza
                                </span>
                                {' '}<span className="text-gray-800">x</span>{' '}
                                <span className="bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#f87171] bg-clip-text text-transparent">
                                    UniAp
                                </span>
                            </h3>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-6">
                            <div>
                                <Label htmlFor="email" className="text-black font-medium">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-2 bg-white border-gray-200 h-12 rounded-xl"
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-black font-medium">Senha</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="mt-2 bg-white border-gray-200 h-12 rounded-xl"
                                    required
                                />
                            </div>


                            {error && (
                                <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-black text-white hover:bg-gray-800 rounded-xl font-medium"
                            >
                                {loading ? 'Criando conta...' : 'Criar conta'}
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-gray-50 text-gray-500">Ou continue com</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Botões de Social Login */}
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleSocialLogin('google')}
                                    className="h-12 border-gray-200 hover:bg-gray-100 rounded-xl"
                                >
                                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    Google
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleSocialLogin('github')}
                                    className="h-12 border-gray-200 hover:bg-gray-100 rounded-xl"
                                >
                                    <Github className="w-5 h-5 mr-2" />
                                    GitHub
                                </Button>
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                Já tem uma conta?{' '}
                                <Link href="/auth/login" className="text-[#d946ef] font-medium hover:underline">
                                    Entrar
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}