import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Welcome to your Arcane Codex!</CardTitle>
          <CardDescription>
            This is your admin panel. From here, you can manage all the content
            of your portfolio. Use the sidebar to navigate to the different
            sections you wish to edit.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            You can edit your personal information, add or remove projects, update your skills, and much more.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
