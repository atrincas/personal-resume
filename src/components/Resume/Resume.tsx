import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { SkillsSection, ExperienceSection } from './Sections'

import {
  Base,
  Main,
  ProfilePicture,
  ContactList,
  MainSection,
  SectionHeader,
  SideSection,
  SideSubSection,
  SideSubSectionHeader,
  Link,
  SubSectionTitleWrapper,
  SkillsWrapper,
  Wrapper,
  Loader,
  LanguageForm,
} from '../../styles'

import { AdressCardIcon, ToolboxIcon, BriefcaseIcon, GraduationCapIcon } from '../Icons'
import { Header } from './Header'
import { Navigation } from '../Navigation'
import Footer from '../Footer'
import db from '../../firestore'
import i18n from '../../i18n'
import { PersonalDetails, JobExperience, Education } from '../../types'

function Resume() {
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [language, setLanguage] = useState('')
  const { t } = useTranslation()
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  useEffect(() => {
    db.doc('resume/personalDetails')
      .get()
      .then((snapshot) => {
        const data = snapshot.data() as PersonalDetails
        setPersonalDetails(data)
      })

    db.collection('translations')
      .get()
      .then((querySnapshot) => {
        let docsProcessed = 0
        querySnapshot.forEach((doc) => {
          docsProcessed++
          i18n.addResourceBundle(doc.id, 'resume', doc.data())
          if (docsProcessed === querySnapshot.size) {
            setLoaded(true)
          }
        })
      })
  }, [])

  useEffect(() => {
    const getLanguage = () => i18n.language || window.localStorage.i18nextLng
    // TODO: Need better fix for setting the correct language:
    if (getLanguage() === 'nl') {
      setLanguage('nl')
    } else {
      setLanguage('en')
    }
  }, [language])

  if (!personalDetails || !loaded)
    return (
      <Wrapper>
        <Loader />
      </Wrapper>
    )

  const { fullName, profession, email, github, linkedIn, location } = personalDetails

  return (
    <>
      <Navigation />
      <LanguageForm>
        <label htmlFor="language-select"></label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value)
            changeLanguage(e.target.value)
          }}
        >
          <option value="nl">Nederlands</option>
          <option value="en">English</option>
        </select>
      </LanguageForm>
      <Base>
        <Main>
          <section>
            <Header name={fullName} title={profession}>
              <ProfilePicture />
            </Header>
            <SideSection>
              <SideSubSection>
                <SideSubSectionHeader>
                  <SubSectionTitleWrapper>
                    <AdressCardIcon />
                    <h3>Contact</h3>
                  </SubSectionTitleWrapper>
                </SideSubSectionHeader>
                <ContactList>
                  <li>{email}</li>
                  <li>
                    <Link href={linkedIn.link} target="blank">
                      {linkedIn.title}
                    </Link>
                  </li>
                  <li>
                    <Link href={github.link} target="blank">
                      {github.title}
                    </Link>
                  </li>
                  <li>{location}</li>
                </ContactList>
              </SideSubSection>
              <SideSubSection>
                <SideSubSectionHeader>
                  <SubSectionTitleWrapper>
                    <ToolboxIcon />
                    <h3>Skills</h3>
                  </SubSectionTitleWrapper>
                </SideSubSectionHeader>
                <SkillsWrapper>
                  <SkillsSection
                    title={t('resume:headers.languages')}
                    skills={t('resume:languages', { returnObjects: true })}
                  />
                  <SkillsSection
                    title="Frameworks & Libraries"
                    skills={t('resume:frameworksLibraries', { returnObjects: true })}
                  />
                  <SkillsSection
                    title="Soft Skills"
                    skills={t('resume:softSkills', { returnObjects: true })}
                  />
                </SkillsWrapper>
              </SideSubSection>
            </SideSection>
          </section>
          <MainSection>
            <section>
              <SectionHeader>
                <BriefcaseIcon />
                <h3>{t('resume:headers.workExperience')}</h3>
              </SectionHeader>
              {t('resume:jobExperience', { returnObjects: true }).map(
                ({ mainTitle, period, subTitle, tasks }: JobExperience) => (
                  <ExperienceSection
                    key={period}
                    mainTitle={mainTitle}
                    subTitle={subTitle}
                    period={period}
                    tasks={tasks}
                  />
                ),
              )}
            </section>
            <section>
              <SectionHeader>
                <GraduationCapIcon />
                <h3>{t('resume:headers.education')}</h3>
              </SectionHeader>
              {t('resume:education', { returnObjects: true }).map(
                ({ mainTitle, period, subTitle }: Education) => (
                  <ExperienceSection
                    key={period}
                    mainTitle={mainTitle}
                    subTitle={subTitle}
                    period={period}
                  />
                ),
              )}
            </section>
          </MainSection>
        </Main>
      </Base>
      <Footer fixedPosition={false} />
    </>
  )
}

export { Resume }
