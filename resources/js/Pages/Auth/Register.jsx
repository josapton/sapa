import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [captchaKey, setCaptchaKey] = useState(Date.now());
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        captcha: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="mt-6 bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-900/50">
                    <div className="flex items-center mb-3 text-orange-800 dark:text-orange-300">
                        <ShieldCheck size={20} className="mr-2" />
                        <span className="font-semibold text-sm">Verifikasi Keamanan</span>
                    </div>

                    <div className="flex flex-col items-center mb-4">
                        <img 
                            src={`/captcha/flat?${captchaKey}`} 
                            alt="Captcha" 
                            className="rounded border border-gray-300 dark:border-gray-600 shadow-sm mb-2"
                        />
                        <button 
                            type="button" 
                            onClick={() => setCaptchaKey(Date.now())}
                            className="text-xs text-orange-600 dark:text-orange-400 hover:text-orange-800 dark:hover:text-orange-300 flex items-center"
                        >
                            <RefreshCw size={12} className="mr-1" />
                            Klik untuk ganti gambar
                        </button>
                    </div>

                    <InputLabel htmlFor="captcha" value="Masukkan teks dari gambar di atas:" className="text-orange-900 dark:text-orange-100" />

                    <TextInput
                        id="captcha"
                        type="text"
                        name="captcha"
                        value={data.captcha}
                        className="mt-1 block w-full text-center tracking-widest text-lg"
                        placeholder="Jawaban Anda"
                        onChange={(e) => setData('captcha', e.target.value)}
                        required
                    />

                    <InputError message={errors.captcha} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4 bg-orange-600 hover:bg-orange-700" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
