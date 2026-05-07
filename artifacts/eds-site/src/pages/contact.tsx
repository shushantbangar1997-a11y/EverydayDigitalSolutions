import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SEO } from "@/components/SEO";
import { site } from "@/lib/constants";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(10, "Please provide a bit more detail about your project"),
  budget: z.string({ required_error: "Please select a budget range" }),
});

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "name": "Start a Project — Everyday Digital Solutions",
  "url": "https://everydaydigitalsolutions.com/contact",
  "description": "Get in touch with Everyday Digital Solutions to discuss your custom software, AI voice agent, or automation project. Based in Mohali and Jalandhar, Punjab.",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://everydaydigitalsolutions.com/"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Start a Project",
        "item": "https://everydaydigitalsolutions.com/contact"
      }
    ]
  }
};

export default function Contact() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      budget: "",
    },
  });

  function onSubmit(_values: z.infer<typeof formSchema>) {
    setTimeout(() => {
      toast({
        title: "Message sent",
        description: "We'll reply within 24 hours.",
      });
      form.reset();
    }, 1000);
  }

  return (
    <>
      <SEO
        title="Start a Project"
        description="Tell us what you're building. We'll scope it on a 15-minute call and send a clear, fixed proposal. Custom apps, AI voice agents, and automation systems — based in Mohali & Jalandhar, Punjab."
        canonical="/contact"
        jsonLd={contactPageSchema}
      />
      <Navbar />
      <main className="pt-8 pb-16 sm:pt-12 lg:pt-28 lg:pb-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[100dvh]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif mb-6 lg:mb-8 leading-tight">
              Start a <em className="text-primary italic">project</em>.
            </h1>
            <p className="text-base lg:text-lg text-muted-foreground mb-10 leading-relaxed">
              Tell us what you're building. We'll scope it on a 15-minute call and send you a clear, fixed proposal — no surprises.
            </p>

            <div className="flex flex-col gap-6 mb-10">
              <div className="flex items-start gap-4">
                <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Call us</h3>
                  <a href={`tel:${site.phone}`} className="text-foreground hover:text-primary transition-colors">{site.phone}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Email us</h3>
                  <a href={`mailto:${site.email}`} className="text-foreground hover:text-primary transition-colors break-all">{site.email}</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MessageCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">WhatsApp</h3>
                  <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-primary transition-colors">Message us directly</a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                {site.offices.map((office: typeof site.offices[number], idx: number) => (
                  <div key={idx} className="flex items-start gap-4">
                    <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground mb-1">{office.city} Office</h3>
                      <address className="not-italic text-sm text-foreground leading-relaxed">
                        {office.address.map((line: string, i: number) => (
                          <span key={i} className="block">{line}</span>
                        ))}
                      </address>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/40 rounded-md p-6 sm:p-8 lg:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} className="bg-background border-border focus-visible:ring-primary rounded-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} className="bg-background border-border focus-visible:ring-primary rounded-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="+91 98765 43210" {...field} className="bg-background border-border focus-visible:ring-primary rounded-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corp" {...field} className="bg-background border-border focus-visible:ring-primary rounded-sm" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background border-border focus:ring-primary rounded-sm">
                            <SelectValue placeholder="Select a budget range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-popover border-border rounded-sm">
                          <SelectItem value="<₹50K">&lt;₹50K</SelectItem>
                          <SelectItem value="₹50K-1L">₹50K – ₹1L</SelectItem>
                          <SelectItem value="₹1L-3L">₹1L – ₹3L</SelectItem>
                          <SelectItem value="₹3L+">₹3L+</SelectItem>
                          <SelectItem value="Not sure yet">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tell us about your project</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What are you looking to build?"
                          className="min-h-[120px] bg-background border-border focus-visible:ring-primary rounded-sm resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90 font-medium py-6 rounded-sm text-base">
                  Send Enquiry
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
