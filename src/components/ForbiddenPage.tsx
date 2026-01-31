import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const ForbiddenPage = () => {
  return (
    <div className="min-h-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold">403</CardTitle>
          <CardDescription className="text-center text-xl">
            No tienes acceso a esta página.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/">Regresar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default ForbiddenPage