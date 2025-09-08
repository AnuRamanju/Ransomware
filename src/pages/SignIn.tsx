
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const SignInSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional()
});

type FormValues = z.infer<typeof SignInSchema>;

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    },
  });

  const onSubmit = (values: FormValues) => {
    console.log('Form submitted:', values);
    // In a real app, this would validate against an API
    // For now, we'll just simulate successful login
    toast({
      title: "Success",
      description: "You've been successfully signed in.",
      variant: "default",
    });
    
    // Redirect to dashboard after successful login
    setTimeout(() => {
      navigate('/dashboard');
    }, 1000);
  };

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
            <h1 className="text-2xl font-bold mb-2">Welcome back</h1>
            <p className="text-gray-400">Sign in to access your dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="flex justify-between">
                      <FormLabel>Password</FormLabel>
                      <Link 
                        to="/forgot-password" 
                        className="text-xs text-cyber-blue hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
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
                  </FormItem>
                )}
              />
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember-me"
                  className="w-4 h-4 rounded border-gray-600 bg-cyber-darker text-cyber-blue focus:ring-cyber-blue"
                  onChange={(e) => form.setValue('rememberMe', e.target.checked)}
                />
                <label htmlFor="remember-me" className="text-sm text-gray-400">
                  Remember me for 30 days
                </label>
              </div>

              <Button type="submit" className="w-full bg-cyber-blue hover:bg-cyber-blue/90">
                Sign In
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-cyber-blue hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
