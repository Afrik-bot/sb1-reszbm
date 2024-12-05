import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Register() {
  return (
    <AuthLayout>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-center text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
            Join LawLink
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose how you want to join our platform
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Client Account</h3>
            <p className="text-gray-600 text-sm mb-4">Perfect for individuals seeking legal consultation and advice.</p>
            <Link to="/register/client" className="block">
              <Button variant="primary" size="lg" className="w-full">
                Sign up as a Client
              </Button>
            </Link>
          </Card>
          
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Legal Consultant</h3>
            <p className="text-gray-600 text-sm mb-4">For legal professionals looking to offer their expertise.</p>
            <Link to="/register/consultant" className="block">
              <Button variant="outline" size="lg" className="w-full">
                Sign up as a Legal Consultant
              </Button>
            </Link>
          </Card>
        </div>

        <div className="text-sm text-center border-t border-gray-200 pt-6 mt-6">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}