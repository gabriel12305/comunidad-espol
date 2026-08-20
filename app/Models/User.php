<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'matricula',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function membresias(){
        return $this->hasMany(Membresia::class);
    }

    public function esLider(): bool
    {
        return $this->membresias()
            ->where('rol', 'presidente')
            ->where('estado', 'aprobada')
            ->exists();
    }

    public function esLiderDe(int $comunidadId): bool
    {
        return $this->membresias()
            ->where('comunidad_id', $comunidadId)
            ->where('rol', 'presidente')
            ->where('estado', 'aprobada')
            ->exists();
    }

    public function esMiembro(): bool
    {
        return $this->membresias()
            ->where('estado', 'aprobada')
            ->exists();
    }

    public function comunidadesQueLidera()
    {
        return Comunidad::whereHas('membresias', function ($query) {
            $query->where('user_id', $this->id)
                ->where('rol', 'presidente')
                ->where('estado', 'aprobada');
        })->get();
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

}
