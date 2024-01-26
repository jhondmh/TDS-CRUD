<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array<string, string>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:25', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            // 'surname' => ['required', 'string', 'max:255'],
            'paternal' => ['required', 'string', 'max:25', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'maternal' => ['required', 'string', 'max:25', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'dni' => ['required', 'size:8', 'regex:/^[0-9]+$/', Rule::unique('users')->ignore($user->id)],
            'email' => ['required', 'email', 'max:40', Rule::unique('users')->ignore($user->id)],

            'fecha_nac' => ['required', 'date', 'after:1950-01-01', 'before_or_equal:today'],

            'departamento' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'provincia' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],
            'distrito' => ['required', 'string', 'max:30', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],


            'current_address' => ['required', 'string', 'max:70', 'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/'],

            'photo' => ['nullable', 'mimes:jpg,jpeg,png', 'max:1024'],
        ])->validateWithBag('updateProfileInformation');

        if (isset($input['photo'])) {
            $user->updateProfilePhoto($input['photo']);
        }

        if (
            $input['email'] !== $user->email &&
            $user instanceof MustVerifyEmail
        ) {
            $this->updateVerifiedUser($user, $input);
        } else {
            $user->forceFill([
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

            ])->save();
        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  array<string, string>  $input
     */
    protected function updateVerifiedUser(User $user, array $input): void
    {
        $user->forceFill([
            'name' => $input['name'],
            // 'surname' => $input['surname'],
            'paternal' => $input['paternal'],
            'maternal' => $input['maternal'],
            'dni' => $input['dni'],
            'email' => $input['email'],
            'email_verified_at' => null,
            'fecha_nac' => $input['fecha_nac'],
            'departamento' => $input['departamento'],
            'pronvincia' => $input['pronvincia'],
            'distrito' => $input['distrito'],
            'current_address' => $input['current_address'],
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}
