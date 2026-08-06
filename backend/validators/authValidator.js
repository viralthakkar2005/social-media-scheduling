const { z } = require('zod');

const signUpSchema = z
  .object({
    fullName: z.string().min(3).max(60),
    email: z.string().email(),
    password: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

module.exports = { signUpSchema, signInSchema };