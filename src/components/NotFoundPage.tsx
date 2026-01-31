import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">404 - Page Not Found</CardTitle>
          <CardDescription className="text-center">
            The page you are looking for doesn't exist.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild>
            <Link to="/">Regresar</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;