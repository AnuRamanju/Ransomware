
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, Shield, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const SignUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .refine(
      (password) => /[A-Z]/.test(password),
      { message: 'Password must contain at least one uppercase letter' }
    )
    .refine(
      (password) => /[a-z]/.test(password),
      { message: 'Password must contain at least one lowercase letter' }
    )
    .refine(
      (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
      { message: 'Password must contain at least one special character' }
    ),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof SignUpSchema>;

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
    // Handle signup logic here - in a real app this would call an API
    
    toast({
      title: "Registration Successful",
      description: "Your account has been created. You can now sign in.",
      variant: "default",
    });
    
    // Redirect to sign in page after successful registration
    setTimeout(() => {
      navigate('/signin');
    }, 1500);
  };

  // Password strength indicators
  const password = form.watch('password');
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLongEnough = password.length >= 8;

  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col justify-center">
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-md mx-auto glass-card p-8 rounded-lg border border-cyber-blue/20">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-cyber-blue/10 rounded-full border border-cyber-blue/30">
                <Shield className="h-8 w-8 text-cyber-blue" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Create your account</h1>
            <p className="text-gray-400">Join the advanced ransomware protection system</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        className="bg-cyber-darker border-cyber-blue/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-cyber-darker border-cyber-blue/20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className="bg-cyber-darker border-cyber-blue/20 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />

                    {/* Password strength indicators */}
                    <div className="mt-3 space-y-1.5">
                      <div className="text-xs text-gray-400 mb-2">Password requirements:</div>
                      <div className="flex items-center text-xs">
                        {isLongEnough ? 
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                          <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                        <span className={isLongEnough ? "text-green-500" : "text-gray-400"}>
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasUpperCase ? 
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                          <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                        <span className={hasUpperCase ? "text-green-500" : "text-gray-400"}>
                          At least 1 uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasLowerCase ? 
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                          <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                        <span className={hasLowerCase ? "text-green-500" : "text-gray-400"}>
                          At least 1 lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center text-xs">
                        {hasSpecialChar ? 
                          <CheckCircle className="h-3.5 w-3.5 text-green-500 mr-1.5" /> : 
                          <XCircle className="h-3.5 w-3.5 text-red-500 mr-1.5" />}
                        <span className={hasSpecialChar ? "text-green-500" : "text-gray-400"}>
                          At least 1 special character
                        </span>
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="bg-cyber-darker border-cyber-blue/20 pr-10"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-cyber-blue hover:bg-cyber-blue/90">
                Create Account <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link to="/signin" className="text-cyber-blue hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
