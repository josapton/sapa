import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        otp: '',
    });

    const submitOtp = (e) => {
        e.preventDefault();
        post(route('verification.otp'));
    };

    const resendOtp = () => {
        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verifikasi Email (OTP)" />

            <div className="mb-4 text-sm text-gray-600">
                Terima kasih telah mendaftar! Kami telah mengirimkan 6-digit kode OTP ke alamat email Anda. 
                Silakan masukkan kode tersebut di bawah ini untuk memverifikasi akun Anda.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Kode OTP baru telah dikirimkan ke alamat email Anda.
                </div>
            )}

            <form onSubmit={submitOtp}>
                <div>
                    <InputLabel htmlFor="otp" value="Kode OTP (6 Digit)" />

                    <TextInput
                        id="otp"
                        type="text"
                        name="otp"
                        value={data.otp}
                        className="mt-1 block w-full text-center text-xl tracking-[0.5em]"
                        isFocused={true}
                        maxLength={6}
                        onChange={(e) => setData('otp', e.target.value)}
                        placeholder="••••••"
                    />

                    <InputError message={errors.otp} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <button
                        type="button"
                        onClick={resendOtp}
                        disabled={processing}
                        className="text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none"
                    >
                        Kirim Ulang OTP
                    </button>

                    <div className="flex items-center space-x-4">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none"
                        >
                            Log Out
                        </Link>
                        <PrimaryButton className="bg-orange-600 hover:bg-orange-700" disabled={processing || data.otp.length !== 6}>
                            Verifikasi
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
