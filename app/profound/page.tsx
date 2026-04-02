"use client"

import React from "react"
import Breadcrumb from "../../components/Breadcrumb"
import CaseStudyTitleLink from "../../components/CaseStudyTitleLink"
import Image from "next/image"
import CaseStudySection from "../../components/CaseStudySection"
import CaseStudyContent from "../../components/CaseStudyContent"
import CaseStudyImage from "../../components/CaseStudyImage"
import CaseStudyHeading from "../../components/CaseStudyHeading"
import CaseStudyText from "../../components/CaseStudyText"
import CaseStudySubheading from "../../components/CaseStudySubheading"
import CaseStudyLogo from "../../components/CaseStudyLogo"
import ScrollProgress from "../../components/ScrollProgress"
import ScrollCarousel from "../../components/ScrollCarousel"
import CaseStudyStickyNav from "../../components/CaseStudyStickyNav"

export default function ProfoundPage() {
  return (
    <>
      <ScrollProgress height={2} />
      <CaseStudyStickyNav current="Profound" />
      <main className="relative overflow-visible" style={{ backgroundColor: 'var(--bg)' }}>

        <CaseStudySection>
          <CaseStudyContent>
            <div className="pt-[96px] pb-2">
              <div className="case-study-header-nav">
                <div className="mb-8"><Breadcrumb current="Profound" /></div>
              </div>
              <CaseStudyLogo>
                <Image src="/images/logos/isotype-dark.png" alt="Profound Logo" width={200} height={200} className="w-full h-full object-contain" priority />
              </CaseStudyLogo>
              <CaseStudyTitleLink title="Profound" href="https://www.tryprofound.com/" />
              <div>
                <CaseStudyHeading>Intro</CaseStudyHeading>
                <CaseStudyText>
                  In 2025, I joined Profound as the sole product designer. The New York–based startup helps brands understand how AI agents like ChatGPT, Perplexity, Google AI Overviews, and Copilot talk about them. Processing over 100 million AI queries each month across 18 countries and 6 languages, Profound supports companies including Indeed, MongoDB, Ramp, and Rho.
                </CaseStudyText>
                <CaseStudyText>
                  With more than 60 percent of consumers starting product research with AI assistants, knowing how these conversations happen has become critical for marketing teams.
                </CaseStudyText>
              </div>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyImage imageSrc="/images/case-studies/profound/pr1.png" imageAlt="Profound interface" isFirst />
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>The Problem</CaseStudyHeading>
              <CaseStudyText>
                AI answer engines are changing the way people discover products. Instead of typing keywords, people are asking AI assistants conversational questions. Traditional SEO tools have no way of showing what is actually being asked.
              </CaseStudyText>
              <CaseStudyText>This shift created three big challenges for marketers:</CaseStudyText>
              <CaseStudyText>No visibility into trending prompts and emerging topics</CaseStudyText>
              <CaseStudyText>No clear sentiment analysis or share of voice for AI results</CaseStudyText>
              <CaseStudyText>No way to see which competitors dominate AI conversations</CaseStudyText>
              <CaseStudyText>Early users told us they did not want raw data dumps. They wanted clarity, trends, and actionable insights.</CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyImage imageSrc="/images/case-studies/profound/platforms.png" imageAlt="Platforms interface" />
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Role and Team</CaseStudyHeading>
              <CaseStudyText>
                I worked closely with engineers and data scientists, leading design from start to finish. My responsibilities included research, UX flows, UI design, and building a scalable design system. I also worked with the founders on product strategy, deciding which insights mattered most and how to present them in a way marketers could act on.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <div className="case-study-section">
          <div className="case-study-image-breakout">
            <ScrollCarousel>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pr2.png" alt="Design process" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pr5.png" alt="User experience flow" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
            </ScrollCarousel>
          </div>
        </div>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Approach</CaseStudyHeading>
              <div>
                <CaseStudySubheading>User Research</CaseStudySubheading>
                <CaseStudyText>
                  I spoke with growth teams, content strategists, and AI researchers using Profound&apos;s early prototype. We found that AI search patterns often had little overlap with Google, that AI conversations covered the entire marketing funnel, and that marketers wanted the ability to group related prompts, track sentiment, and see which websites influenced AI answers.
                </CaseStudyText>
              </div>
              <div>
                <CaseStudySubheading>Competitive Research</CaseStudySubheading>
                <CaseStudyText>
                  I analysed leading SEO and keyword-tracking tools including Semrush, Ahrefs, Ubersuggest, and Google Trends. While they excel at keyword rankings and backlink analysis, none could surface AI prompt-level insights or reveal how AI agents respond to real questions. This confirmed that Profound had a clear opportunity to lead in a new category.
                </CaseStudyText>
              </div>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Design and Development</CaseStudyHeading>
              <CaseStudyText>Hierarchical Explorer allowed users to move from broad topics to specific prompts, making large datasets easy to navigate</CaseStudyText>
              <CaseStudyText>Bulk Analysis let marketers compare up to 200,000 prompts with advanced filters for date, region, language, and AI platform</CaseStudyText>
              <CaseStudyText>Answer Engine Insights provided dashboards with visibility scores, sentiment breakdowns, and share of voice trends</CaseStudyText>
              <CaseStudyText>Agent Analytics gave human-readable visualisations of AI crawler activity across domains</CaseStudyText>
              <CaseStudyText>Design System used modular Figma components to maintain consistency and speed up engineering</CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <div className="case-study-section">
          <div className="case-study-image-breakout">
            <ScrollCarousel>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pr3.png" alt="Insights" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pr6.png" alt="Feedback analysis" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pr7.png" alt="Findings" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pr4.png" alt="Journey mapping" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pem1.png" alt="Design interface" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pem2.png" alt="Bulk analysis" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pem3.png" alt="Keyword analysis" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pem4.png" alt="Search results" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pem5.png" alt="Prompt recommendations" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/profound/pem6.png" alt="Prompt designer" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
            </ScrollCarousel>
          </div>
        </div>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Challenges</CaseStudyHeading>
              <CaseStudyText>Translating billions of real-time data points into a clear, usable interface</CaseStudyText>
              <CaseStudyText>Designing around privacy restrictions by summarising and grouping prompts instead of showing raw text</CaseStudyText>
              <CaseStudyText>Turning technical crawler logs and sentiment models into practical, actionable insights for marketers</CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Solution</CaseStudyHeading>
              <CaseStudyText>Answer Engine Insights to track mentions, sentiment, and competitor share of voice</CaseStudyText>
              <CaseStudyText>Agent Analytics to monitor AI crawlers and link their activity to traffic</CaseStudyText>
              <CaseStudyText>Conversation Explorer to reveal trending questions and hidden AI search patterns</CaseStudyText>
              <CaseStudyText>A scalable design system supporting both enterprise clients and a $499/month self-serve plan</CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Impact</CaseStudyHeading>
              <CaseStudyText>Ramp increased AI visibility in the accounts-payable sector from 3.2% to 22.2% in one month</CaseStudyText>
              <CaseStudyText>1840 and Company went from zero to 11% AI visibility in remote staffing, entering the top five in their category</CaseStudyText>
              <CaseStudyText>Profound now processes more than 100 million queries per month across 18 countries and 6 languages</CaseStudyText>
              <CaseStudyText>Early adopters reported a 25–40% lift in AI share of voice within 60 days</CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Reflection</CaseStudyHeading>
              <CaseStudyText>
                Profound showed me how rapidly shifting industry trends can create entirely new product categories. I learned to design within data privacy and technical constraints while making complex AI insights accessible. The project reinforced the value of aligning user experience with evolving behaviours in how people search and consume information.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>
      </main>
    </>
  )
}
