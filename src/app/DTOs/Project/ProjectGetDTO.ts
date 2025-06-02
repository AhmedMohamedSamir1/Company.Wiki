import { DependencyInfoDTO } from "../Dependency/DependencyInfoDTO";
import { TagInfoDTO } from "../Tag/TagInfoDTO";
import { TechnologyInfoDTO } from "../Technology/TechnologyInfoDTO";


export interface ProjectGetDTO {
    id: number;
    name: string;                      
    description: string;               
    projectLink: string;               
    projectOwner: string;              
    instructions: string;   
    tags: TagInfoDTO[];
    dependencies: DependencyInfoDTO[];
    technologies: TechnologyInfoDTO[];
    websiteLink: string |null;              // Optional
    client: string | null;                   // Optional
    brand: string  | null;                    // Optional

    createdDate: Date,
    modifiedDate: Date,

  }