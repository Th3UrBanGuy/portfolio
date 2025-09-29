import { getPortfolioData } from '@/lib/placeholder-data';
import { ProjectsForm } from './components';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Project } from '@/lib/types';


// We need to map the internal project type to what the form expects
// This is because the main `Project` type derives some fields, but `projects.json` is the source of truth.
const mapProjectsToFormData = (projects: Project[]) => {
  return projects.map(p => ({
    id: p.id,
    title: p.name,
    short_description: p.description,
    image_url: p.imageUrl, // In projects.json this is just the filename, but placeholder-data resolves it. This might need adjustment. For now, we pass it as is.
    full_description: p.full_description,
    technologies: p.technologies,
    preview_link: p.preview_link,
    documentation_link: p.documentation_link,
    category: p.category,
  }));
}

export default async function ProjectsPage() {
  const portfolioData = await getPortfolioData();
  const projectsForForm = mapProjectsToFormData(portfolioData.projects);

  return (
    <div className="space-y-6">
       <Card>
        <CardHeader>
          <CardTitle>Manage Projects</CardTitle>
          <CardDescription>
            Add, edit, or remove the projects and project bundles that appear on your portfolio.
          </CardDescription>
        </CardHeader>
      </Card>
      <ProjectsForm data={projectsForForm} />
    </div>
  );
}
