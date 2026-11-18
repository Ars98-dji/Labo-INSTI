// src/components/Pages/InfoPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './InfoPage.css';

const OFFICIAL_LINKS = [
  { href: 'https://insti.edu.bj', label: 'Site officiel de l’INSTI' },
  { href: 'https://insti.unstim.bj', label: 'INSTI sur le portail UNSTIM' }
];

const PAGES = {
  presentation: {
    title: 'Présentation de l’INSTI',
    subtitle:
      'Institut National Supérieur de Technologie Industrielle de Lokossa',
    intro:
      "Établissement public universitaire d'enseignement technique et professionnel, l'INSTI est implanté à Agnivèdji, à Lokossa (Bénin). Il est placé sous la tutelle de l'UNSTIM — Université Nationale des Sciences, Technologies, Ingénieries et des Mathématiques.",
    stats: [
      { value: '2001', label: 'Ouverture (ex-IUT)' },
      { value: '2018', label: 'Naissance de l’INSTI' },
      { value: '5', label: 'Filières' },
      { value: '6 + 1', label: 'Labos pédagogiques + LaPIT' }
    ],
    sections: [
      {
        title: 'Une histoire industrielle depuis 2001',
        text: "L'Institut a ouvert ses portes en 2001 sous le nom d'Institut Universitaire de Technologie (IUT) de Lokossa, alors rattaché à l'Université d'Abomey-Calavi. En avril 2018, il devient l'INSTI et rejoint l'UNSTIM. Depuis plus de vingt ans, il forme les techniciens supérieurs et les ingénieurs dont l'industrie béninoise et la sous-région ont besoin."
      },
      {
        title: 'Notre mission',
        text: "Former des professionnels hautement qualifiés dans les domaines du génie civil, du génie électrique et informatique, du génie énergétique, du génie mécanique et de la maintenance. La formation combine enseignement théorique, travaux pratiques en laboratoire et stages en entreprise, et s'étend à la formation continue des professionnels en activité."
      },
      {
        title: 'Un ancrage dans l’industrie',
        text: "Cinq filières, six laboratoires pédagogiques et un laboratoire de recherche (LaPIT) structurent les activités de l'Institut. Les partenariats avec les entreprises et les institutions encadrent les stages, les projets techniques et l'insertion professionnelle des diplômés."
      },
      {
        title: 'Le campus',
        text: "L'INSTI est situé à Lokossa, quartier Agnivèdji. BP 14 Lokossa — Tél. (+229) 22 41 13 66 — insti@unstim.bj. La devise de l'Institut est « Former pour innover »."
      }
    ]
  },

  formations: {
    title: 'Nos formations',
    subtitle: 'Des licences professionnelles tournées vers les métiers de l’industrie',
    intro:
      "L'INSTI propose des licences professionnelles organisées en cinq filières, complétées par des masters et des formations à distance. L'admission est ouverte aux titulaires d'un baccalauréat scientifique ou technique, selon les conditions publiées chaque année.",
    programs: [
      {
        code: 'GC',
        name: 'Génie Civil',
        specialties: ['Bâtiment et Travaux Publics'],
        outcomes:
          'Conduite et contrôle de chantiers, bureaux d’études, essais sur les matériaux, contrôle qualité des ouvrages.'
      },
      {
        code: 'GEI',
        name: 'Génie Électrique et Informatique',
        specialties: ['Électrotechnique et Électronique', 'Informatique et Télécoms'],
        outcomes:
          'Exploitation de systèmes électriques, réseaux et télécommunications, automatisation, assistance aux laboratoires.'
      },
      {
        code: 'GE',
        name: 'Génie Énergétique',
        specialties: ['Énergies Renouvelables et Systèmes Énergétiques', 'Froid et Climatisation'],
        outcomes:
          'Dimensionnement d’installations énergétiques, efficacité énergétique, froid industriel et climatisation.'
      },
      {
        code: 'GMP',
        name: 'Génie Mécanique et Productique',
        specialties: ['Conception et fabrication mécanique'],
        outcomes:
          'Conception mécanique, usinage, industrialisation et gestion d’unités de production.'
      },
      {
        code: 'MS',
        name: 'Maintenance des Systèmes',
        specialties: ['Maintenance Automobile', 'Maintenance des Systèmes Industriels'],
        outcomes:
          'Diagnostic et maintenance de parcs machines, gestion d’ateliers et de magasins de pièces, fiabilité des équipements.'
      }
    ],
    cta: {
      to: '/',
      label: 'Découvrir les laboratoires et les équipements'
    }
  },

  actualites: {
    title: 'Actualités de l’Institut',
    subtitle: 'Les étapes et la vie de l’INSTI Lokossa',
    intro:
      "Retrouvez ici les informations marquantes de la vie de l'Institut. Les actualités officielles, événements scientifiques et communiqués sont publiés sur le site de l'INSTI.",
    timeline: [
      {
        year: '2001',
        title: 'Ouverture de l’IUT de Lokossa',
        text: "L'Institut Universitaire de Technologie accueille ses premiers étudiants, sous la tutelle de l'Université d'Abomey-Calavi."
      },
      {
        year: '2018',
        title: 'Naissance de l’INSTI',
        text: "L'établissement devient l'Institut National Supérieur de Technologie Industrielle et rejoint l'UNSTIM."
      },
      {
        year: '2022',
        title: 'Vingt ans de formation industrielle',
        text: "L'Institut célèbre vingt années de savoirs et de savoir-faire au service du secteur industriel."
      },
      {
        year: '2026',
        title: 'Une plateforme numérique pour les laboratoires',
        text: "Ce site présente les filières, les laboratoires, les équipements et les travaux pratiques, et permet aux équipes de l'Institut de les gérer en ligne."
      }
    ],
    cta: {
      href: 'https://insti.edu.bj/actualites',
      label: 'Lire les actualités officielles'
    }
  },

  'vie-academique': {
    title: 'Vie académique',
    subtitle: 'Un accompagnement complet, du baccalauréat à l’insertion',
    intro:
      "Au-delà des cours et des travaux pratiques, l'INSTI anime une vie de campus riche, portée par ses étudiants et par les services d'accompagnement de l'Institut.",
    sections: [
      {
        title: 'Clubs et associations',
        text: "Les étudiants animent des clubs scientifiques, techniques et culturels. Ces initiatives complètent la formation et développent l'esprit d'équipe, la créativité et le sens des responsabilités."
      },
      {
        title: 'Calendrier universitaire',
        text: "L'année académique s'organise en semestres, avec des périodes d'enseignements, d'évaluations, de stages et de soutenances. Le calendrier officiel est communiqué par l'administration."
      },
      {
        title: 'Bourses et aides sociales',
        text: "Les étudiants peuvent bénéficier des dispositifs de bourses et d'aides mis en place par l'État et l'université, selon les critères et les campagnes annuelles."
      },
      {
        title: 'Orientation et insertion',
        text: "Stages, projets industriels et accompagnement à l'insertion préparent les diplômés aux métiers de technicien supérieur, de chargé d'études, de maintenance ou de production."
      },
      {
        title: 'Activités culturelles et sportives',
        text: "L'Institut encourage les activités culturelles et sportives, qui rythment la vie du campus et favorisent le bien-être de la communauté estudiantine."
      }
    ],
    cta: {
      href: 'https://insti.edu.bj/organisation',
      label: 'Consulter le site officiel'
    }
  },

  recherches: {
    title: 'Recherches & coopérations',
    subtitle: 'Des laboratoires au service de la formation et de l’innovation',
    intro:
      "L'INSTI appuie son enseignement sur un laboratoire de recherche et six laboratoires pédagogiques, ouverts aux projets d'innovation, aux essais techniques et aux partenariats avec le monde industriel.",
    sections: [
      {
        title: 'LaPIT',
        text: "Le Laboratoire des Procédés et de l'Innovation Technologique (LaPIT) porte les activités de recherche appliquée de l'Institut, en lien avec les procédés industriels et le transfert de technologie."
      },
      {
        title: 'Six laboratoires pédagogiques',
        text: "Génie civil, génie électrique et informatique, génie énergétique, génie mécanique et productique, maintenance des systèmes : les plateaux techniques encadrent les travaux pratiques des cinq filières."
      },
      {
        title: 'Axes de travail',
        text: "Matériaux et infrastructures, énergie et efficacité énergétique, systèmes électriques et numériques, conception et fabrication mécanique, maintenance et fiabilité des équipements."
      },
      {
        title: 'Partenariats et coopérations',
        text: "L'Institut développe des coopérations avec l'UNSTIM, les entreprises et les institutions du secteur industriel : stages, projets techniques, formation continue et mobilité."
      }
    ],
    cta: {
      to: '/',
      label: 'Explorer les laboratoires de l’INSTI'
    }
  }
};

const InfoPage = ({ page }) => {
  const content = PAGES[page];

  if (!content) {
    return null;
  }

  return (
    <article className="info-page">
      <header className="info-hero">
        <div className="container">
          <h1>{content.title}</h1>
          <p>{content.subtitle}</p>
        </div>
      </header>

      <div className="container info-body">
        <p className="info-intro">{content.intro}</p>

        {content.stats && (
          <div className="info-stats">
            {content.stats.map((stat) => (
              <div className="info-stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
        )}

        {content.programs && (
          <div className="programs-list">
            {content.programs.map((program) => (
              <section className="program-card" key={program.code}>
                <div className="program-code">{program.code}</div>
                <div>
                  <h2>{program.name}</h2>
                  <p className="program-specialties">
                    Spécialités : {program.specialties.join(' · ')}
                  </p>
                  <p>{program.outcomes}</p>
                </div>
              </section>
            ))}
          </div>
        )}

        {content.sections && (
          <div className="info-grid">
            {content.sections.map((section) => (
              <section className="info-card" key={section.title}>
                <h2>{section.title}</h2>
                <p>{section.text}</p>
              </section>
            ))}
          </div>
        )}

        {content.timeline && (
          <ol className="info-timeline">
            {content.timeline.map((item) => (
              <li key={item.title}>
                <span className="timeline-year">{item.year}</span>
                <div>
                  <h2>{item.title}</h2>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ol>
        )}

        {content.cta && (
          <p className="info-cta">
            {content.cta.to ? (
              <Link to={content.cta.to} className="info-cta-link">
                {content.cta.label} →
              </Link>
            ) : (
              <a
                href={content.cta.href}
                className="info-cta-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.cta.label} →
              </a>
            )}
          </p>
        )}

        <footer className="info-sources">
          <span>Informations publiques :</span>
          {OFFICIAL_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </footer>
      </div>
    </article>
  );
};

export default InfoPage;
