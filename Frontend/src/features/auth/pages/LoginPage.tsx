import LoginForm from '../components/LoginForm'

function LoginPage() {
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-4xl mx-4">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage