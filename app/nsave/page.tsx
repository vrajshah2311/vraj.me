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
import CaseStudyLogo from "../../components/CaseStudyLogo"
import ScrollProgress from "../../components/ScrollProgress"
import ScrollCarousel from "../../components/ScrollCarousel"

export default function NsavePage() {
  return (
    <>
      <ScrollProgress height={2} />
      <main className="relative overflow-visible" style={{ backgroundColor: 'var(--bg)' }}>

        <CaseStudySection>
          <CaseStudyContent>
            <div className="pt-[96px]">
              <div className="case-study-header-nav">
                <div className="mb-8"><Breadcrumb current="nsave" /></div>
              </div>
              <CaseStudyLogo>
                <Image src="/images/logos/nsave-logo.webp" alt="nsave Logo" width={200} height={200} className="w-full h-full object-contain" priority />
              </CaseStudyLogo>
              <CaseStudyTitleLink title="nsave" href="https://nsave.com" />
              <div>
                <CaseStudyHeading>Intro</CaseStudyHeading>
                <CaseStudyText>
                  nsave is a cross-border fintech platform for emerging markets that brings savings, investments, and everyday banking into one simple, intuitive experience. Designed for transparency, accessibility, and financial literacy, it helps people in underbanked and high-inflation regions securely manage, grow, and move their money.
                </CaseStudyText>
                <CaseStudyText>
                  I led the design from concept to launch, ensuring every detail addressed user needs while meeting strict regulatory requirements.
                </CaseStudyText>
              </div>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyImage imageSrc="/images/case-studies/nsave/ns1.png" imageAlt="nsave platform overview" isFirst />
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Problem</CaseStudyHeading>
              <CaseStudyText>
                Users in high-inflation countries struggle with traditional banking systems that lack transparency, charge hidden fees, and provide poor user experiences for international transfers and investments. Existing solutions are often complex, expensive, and don&apos;t address the specific needs of these markets.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Role & Team</CaseStudyHeading>
              <CaseStudyText>
                Owned the design vision and execution from concept to launch, working closely with engineering, product, and growth teams to deliver features that met user needs, complied with regulations, and supported business growth. Led every stage from research and ideation to prototyping, testing, and final delivery.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Approach</CaseStudyHeading>
              <CaseStudyText>
                Spoke directly with users, studied competitors, and reviewed local regulations to understand needs across target markets. The research showed a clear demand for transparency, simplicity, and better financial literacy tools.
              </CaseStudyText>
              <CaseStudyText>
                Created detailed PRDs for every feature to ensure alignment between design, engineering, and business from day one. Worked closely with engineering to explore technical possibilities and partnered with growth to plan rollouts and define test strategies.
              </CaseStudyText>
              <CaseStudyText>
                Delivered a clean, minimalist interface focused on clarity and intuitive navigation, even for complex financial operations. Integrated real-time data updates and transparent fee calculators to build trust with users.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <div className="case-study-image-breakout">
            <ScrollCarousel>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns2.png" alt="Platform interface" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns3.png" alt="User research insights" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns4.png" alt="Interface design" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns5.png" alt="User flow diagrams" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns6.png" alt="Dashboard design" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns7.png" alt="Mobile interface" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns8.png" alt="Investment tools" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
            </ScrollCarousel>
          </div>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Challenges</CaseStudyHeading>
              <CaseStudyText>Designing a cross-border financial product complying with multiple regulatory frameworks while remaining easy to use</CaseStudyText>
              <CaseStudyText>Simplifying investments, savings, and cross-border transfers for users new to digital finance</CaseStudyText>
              <CaseStudyText>Creating a platform that works across different currencies, payout systems, and local market conditions</CaseStudyText>
              <CaseStudyText>Building credibility and user confidence in regions where financial instability is common</CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Solution</CaseStudyHeading>
              <CaseStudyText>
                A financial platform that is simple, transparent, and built for global use. The main screen shows a unified account balance including savings, investments, available funds, and interest earned.
              </CaseStudyText>
              <CaseStudyText>
                Users can send and receive money, cash out to local merchants, invest in stocks, ETFs, bonds, and precious metals, and manage multi-currency accounts in USD, GBP, and EUR — with both virtual and physical cards for global spending.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <div className="case-study-image-breakout">
            <ScrollCarousel>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns9.png" alt="Platform metrics" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
              <div className="flex-shrink-0"><div className="case-study-image-box"><Image src="/images/case-studies/nsave/ns11.png" alt="Platform overview" width={800} height={600} className="w-full h-full object-cover" loading="lazy" /></div></div>
            </ScrollCarousel>
          </div>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Impact</CaseStudyHeading>
              <CaseStudyText>
                Successfully launched a cross-border financial platform serving users across multiple emerging markets, providing transparent, accessible banking services.
              </CaseStudyText>
              <CaseStudyText>
                The platform helped users in high-inflation countries better manage their finances, with features addressing their specific needs for international transfers and investments.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyImage imageSrc="/images/case-studies/nsave/ns10.png" imageAlt="nsave raises $18M Series A funding" />
        </CaseStudySection>

        <CaseStudySection>
          <CaseStudyContent>
            <div>
              <CaseStudyHeading>Reflection</CaseStudyHeading>
              <CaseStudyText>
                Working on nsave deepened my understanding of the financial challenges in emerging markets and how industry constraints shape product decisions. I learned to design experiences that build trust while accommodating strict compliance and varied user behaviours. It reinforced the importance of simplifying complex financial actions without losing functionality.
              </CaseStudyText>
            </div>
          </CaseStudyContent>
        </CaseStudySection>
      </main>
    </>
  )
}
