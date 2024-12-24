import { getPermalink, getBlogPermalink, getAsset } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: "/",
    },
    {
      text: 'Servicing',
      links: [
        {
          text: 'Small Business',
          href: getPermalink('/services#smb'),
        },
        {
          text: 'End Users',
          href: getPermalink('/services#eus'),
        },
        {
          text: 'Not For Profits',
          href: getPermalink('/nfp'),
        },
      ]
    },
    {
      text: 'Projects',
      href: "/projects",
    },
    {
      text: 'About',
      href: "/about",
    },
    {
      text: 'Contact',
      href: "/contact",
    },
    {
      text: 'Extras',
      links: [
        {
          text: 'Scams',
          href: getPermalink('/scams'),
        },
        {
          text: "Alex's Blog",
          icon: "mdi:external",
          href: "https://blog.alexsguardian.net",
        },
        {
          text: 'Privacy Policy',
          href: getPermalink('/privacy'),
        }
      ],
    },
  ],
};

export const footerData = {
  links: [
    {
      title: 'Support',
      links: [
        { text: 'Docs', href: '#' },
        { text: 'Community Forum', href: '#' },
        { text: 'Professional Services', href: '#' },
        { text: 'Skills', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Shop', href: '#' }
      ],
    },
  ],
  secondaryLinks: [
    // { text: 'Terms', href: getPermalink('/terms') },
    { text: 'Privacy Policy', href: getPermalink('/privacy') },
  ],
  socialLinks: [
    { ariaLabel: 'Bluesky', icon: 'tabler:brand-bluesky', href: 'https://bsky.app/profile/alexsguardian.net' },
    { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: 'https://www.facebook.com/people/Alexs-Guardian/100064867567241/' },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/alexsguardian' },
  ],
  footNote: `
    <img class="w-5 h-5 md:w-6 md:h-6 md:-mt-0.5 bg-cover mr-1.5 rtl:mr-0 rtl:ml-1.5 float-left rtl:float-right rounded-sm" src="/src/assets/favicons/favicon.svg" alt="alex's guardian logo" loading="lazy"></img>
    © 2024 - Alex's Guardian. All rights reserved.
  `,
};
