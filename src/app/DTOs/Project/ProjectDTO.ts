export interface ProjectDTO {
    name: string;                      
    description: string;               
    projectLink: string;               
    instructions: string;               
    tags: number[];                    
    dependencies: number[];            
    technologies: number[];            
    websiteLink: string |null;              // Optional
    client: string | null;                   // Optional
    brand: string  | null;                    // Optional
  }