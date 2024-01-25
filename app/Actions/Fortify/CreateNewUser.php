<?php

namespace App\Actions\Fortify;

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Unique;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Laravel\Jetstream\Jetstream;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:25', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            // 'surname' => ['required', 'string', 'max:255'],
            'paternal' => ['required', 'string', 'max:15', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'maternal' => ['required', 'string', 'max:15', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'dni' => ['required', 'size:8', 'regex:/^[0-9]+$/', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:40', 'unique:users'],
            'password' => $this->passwordRules(),

            'fecha_nac' => ['required', 'date', 'after:1950-01-01', 'before_or_equal:today'],

            'departamento' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'provincia' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'distrito' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],


            'current_address' => ['required', 'string', 'max:70', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],

            'terms' => Jetstream::hasTermsAndPrivacyPolicyFeature() ? ['accepted', 'required'] : '',
        ])->validate();

        return DB::transaction(function () use ($input) {
            return tap(User::create([
                'name' => $input['name'],
                // 'surname' => $input['surname'],
                'paternal' => $input['paternal'],
                'maternal' => $input['maternal'],
                'dni' => $input['dni'],
                'email' => $input['email'],
                'fecha_nac' => $input['fecha_nac'],
                'departamento' => $input['departamento'],
                'provincia' => $input['provincia'],
                'distrito' => $input['distrito'],
                'current_address' => $input['current_address'],
                'password' => Hash::make($input['password']),
            ]), function (User $user) {
                $this->createTeam($user);
            });
        });
    }

    /**
     * Create a personal team for the user.
     */
    protected function createTeam(User $user): void
    {
        // $user->ownedTeams()->save(Team::forceCreate([
        //     'user_id' => $user->id,
        //     'name' => 'Equipo de ' . explode(' ', $user->name, 2)[0],
        //     'personal_team' => true,
        // ]));
        $nameParts = explode(' ', strtolower($user->name));
        $capitalizedNameParts = array_map('ucfirst', $nameParts);
        $capitalizedName = implode(' ', $capitalizedNameParts);

        $user->ownedTeams()->save(Team::forceCreate([
            'user_id' => $user->id,
            'name' => 'Equipo de ' . $capitalizedName,
            'personal_team' => true,
        ]));
    }
}
