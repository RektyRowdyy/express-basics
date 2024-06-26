export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: 'Username must be atleast 5 characters with a max of 32 characters'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty',
        },
        isString: {
            errorMessage: 'Username must be a string'
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: 'displayName cannot be empty'
        }
    },
    password: {
        notEmpty: {
            errorMessage: 'password cannot be empty'
        }
    }
}