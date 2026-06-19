<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\PseudonymDictionary;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create initial super admin
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@sapa.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'pseudonym' => 'Admin Utama',
        ]);

        // Create some Dosen
        User::create([
            'name' => 'Dosen Pembimbing',
            'email' => 'dosen@sapa.test',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'dosen',
            'pseudonym' => 'Dosen 1',
        ]);

        // Seed Pseudonym Dictionary
        $faunas = ['Harimau', 'Elang', 'Kucing', 'Paus', 'Lumba-lumba', 'Merpati', 'Singa', 'Gajah', 'Jerapah', 'Kelinci'];
        $floras = ['Anggrek', 'Mawar', 'Melati', 'Bunga Matahari', 'Tulip', 'Beringin', 'Jati', 'Kamboja', 'Teratai', 'Raflesia'];

        foreach ($faunas as $name) {
            PseudonymDictionary::create(['name' => $name, 'category' => 'fauna']);
        }

        foreach ($floras as $name) {
            PseudonymDictionary::create(['name' => $name, 'category' => 'flora']);
        }

        // Seed Categories
        $categories = [
            ['name' => 'Akademik', 'slug' => 'akademik', 'description' => 'Terkait perkuliahan, nilai, dan dosen'],
            ['name' => 'Fasilitas', 'slug' => 'fasilitas', 'description' => 'Terkait gedung, AC, proyektor, parkir'],
            ['name' => 'Pelayanan', 'slug' => 'pelayanan', 'description' => 'Terkait layanan tata usaha, akademik, dll'],
            ['name' => 'Keamanan', 'slug' => 'keamanan', 'description' => 'Terkait keamanan lingkungan kampus'],
            ['name' => 'Lainnya', 'slug' => 'lainnya', 'description' => 'Kategori lain yang tidak tercantum'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }
    }
}
