import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { LearningMethodsSection } from "@/components/learning-methods-section"
import { StatsSection } from "@/components/stats-section"
import { RankingSection } from "@/components/ranking-section"
import { ProjectsSection } from "@/components/projects-section"
import { BadgesSection } from "@/components/badges-section"
import { Footer } from "@/components/footer"
import UserFetcher from '@/components/user-fetcher'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-14">
        <HeroSection />
        <LearningMethodsSection />
        <StatsSection />
        <RankingSection />
        <ProjectsSection />
        <BadgesSection />
        
        {/* <UserFetcher /> */}
      </main>
      <Footer />
    </div>
  )
}
