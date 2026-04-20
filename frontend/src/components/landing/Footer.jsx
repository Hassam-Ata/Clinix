import { Activity, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="pt-20 pb-10 bg-muted/50 border-t">
      <div className="container mx-auto px-4">
     

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
          <p>© 2024 Clinix Healthcare Platform. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-primary">Medical Compliance</a>
            <a href="#" className="hover:text-primary">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
