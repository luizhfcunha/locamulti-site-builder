import { TopBar } from "@/components/TopBar";
import { HeaderDesktop } from "@/components/HeaderDesktop";
import { HeaderMobile } from "@/components/HeaderMobile";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const isMobile = useIsMobile();
  const hostname = window.location.hostname;
  const isAdminSubdomain = hostname.startsWith("admin.");

  // On admin subdomain, show simplified header
  if (isAdminSubdomain) {
    return (
      <>
        <TopBar />
        {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      </>
    );
  }

  return (
    <>
      {/* TopBar only on desktop */}
      {!isMobile && <TopBar />}
      
      {/* Responsive Header */}
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
    </>
  );
};
