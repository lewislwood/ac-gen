export {};

declare global {
  namespace lwLib {
    interface acURLs  {
      action : string;
      docs: string[];
        previous: string;
        next: string;
        current: string;
        'docs-about': string;
        'docs-instructions': string;
        "docs-download": string;
        'docs-index': string;
        "docs-developer": string;
        import: string;
        html: string;
        git: string;
        nodejs: string;
        website: string;
    repo: string;
    zip: string;
    }
    interface TemplateFiles {
      initialized: boolean;
      mediaTypes: string[];
      media: string;
   info: string;
   post: string;
  }
  interface FolderLayout {
      public: string;
      media: string;
      templates: string;
      docs?: string;
  }
interface templateFileStatus {
  name: string;
  media?: string;
  status?: string;
  error?: string;
}
interface templateStatus {
folder: string;
types?: string;
catalog: templateFileStatus[];
mediaFiles: templateFileStatus[];
status: string;
}

type MediaItem = {
    file: string
    name: string
    anchor?: string
    type: string
    Modified: Date
    description: string
    order: number
    category: string
    size: number
    length?: string | null
  }
  type MediaItem = {
    file: string
    name: string
    type: string
    Modified: Date
    description: string
    order: number
    category: string
    size: number
    length?: string | null
  }

  //    Catalog properties 
  type Catalog = {
    logo?: string
    logoAlt: string;
    doc_title?: string
    cat_title?: string
    allow_category_filter?: boolean
    category_filter?: string
    menu_link?: string
    menu_text?: string
    help: string
    overview: string
    post_description?: string
    mediaList: lwLib.MediaItem[]
    application: Application
    volume: number;
  }


  }
}