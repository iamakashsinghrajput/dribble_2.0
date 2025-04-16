import type { Shot, User } from '@/components/shot/ShotCard';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Odama',
    username: 'odamastudio',
    avatarUrl: 'https://ext.same-assets.com/3661172889/380222744.png',
    isTeam: true
  },
  {
    id: '2',
    name: 'Type08 (Alen Pavlovic)',
    username: 'Type08',
    avatarUrl: 'https://ext.same-assets.com/2372739326/4092125858.jpeg',
    isPro: true
  },
  {
    id: '3',
    name: 'Andrey Prokopenko',
    username: 'Pro_Art',
    avatarUrl: 'https://ext.same-assets.com/2372739326/158855353.jpeg',
    isPro: true
  },
  {
    id: '4',
    name: 'Heyo',
    username: 'teamheyo',
    avatarUrl: 'https://ext.same-assets.com/2372739326/2515450901.png',
    isTeam: true
  },
  {
    id: '5',
    name: 'Plainthing Studio',
    username: 'plainthingstudio',
    avatarUrl: 'https://ext.same-assets.com/2372739326/1524499685.png',
    isTeam: true
  },
  {
    id: '6',
    name: 'One Week Wonders',
    username: 'oneweekwonders',
    avatarUrl: 'https://ext.same-assets.com/2372739326/295774544.png',
    isTeam: true
  },
  {
    id: '7',
    name: 'Ramotion',
    username: 'ramotion',
    avatarUrl: 'https://ext.same-assets.com/2372739326/3984687928.png',
    isTeam: true
  },
  {
    id: '8',
    name: 'Yondr Studio',
    username: 'nathanyoder',
    avatarUrl: 'https://ext.same-assets.com/2372739326/3930299863.jpeg',
    isPro: true
  },
];

// Mock Shots
export const mockShots: Shot[] = [
  {
    id: '25907275',
    title: 'Haymarket - Marketing Agency Website',
    imageUrl: 'https://ext.same-assets.com/2372739326/1059898963.webp',
    likes: 73,
    views: 3500,
    user: mockUsers[0],
    tags: ['agency', 'website', 'marketing', 'ui', 'web design'],
  },
  {
    id: '25905911',
    title: 'Logo Collection > Birds Volume 03',
    imageUrl: 'https://ext.same-assets.com/2372739326/2997358501.webp',
    likes: 96,
    views: 14600,
    user: mockUsers[1],
    tags: ['branding', 'logo', 'collection', 'birds'],
  },
  {
    id: '25905633',
    title: 'Reindeer in Golden Light',
    imageUrl: 'https://ext.same-assets.com/2372739326/3380674425.webp',
    likes: 120,
    views: 16800,
    user: mockUsers[2],
    tags: ['illustration', 'golden', 'light', 'nature'],
  },
  {
    id: '25905838',
    title: 'FarmGirl Fresh',
    imageUrl: 'https://ext.same-assets.com/2372739326/90877412.webp',
    likes: 96,
    views: 14200,
    user: mockUsers[3],
    tags: ['branding', 'design', 'logo', 'lettering'],
  },
  {
    id: '25907168',
    title: 'Cascades Restaurant Ubud  Website Redesign',
    imageUrl: 'https://ext.same-assets.com/2372739326/3504439573.webp',
    likes: 74,
    views: 2700,
    user: mockUsers[4],
    tags: ['ui', 'uiux', 'web design', 'restaurant', 'travel'],
  },
  {
    id: '25907220',
    title: 'When The Weekend Comes',
    imageUrl: 'https://ext.same-assets.com/2372739326/3729991488.webp',
    likes: 43,
    views: 2100,
    user: mockUsers[5],
    tags: ['illustration', 'childrens illustration', 'weekend'],
    isAnimated: true,
  },
  {
    id: '25903662',
    title: 'Startup Branding for Holidu: visual identity, brand design',
    imageUrl: 'https://ext.same-assets.com/2372739326/2153853969.webp',
    likes: 71,
    views: 1400,
    user: mockUsers[6],
    tags: ['branding', 'identity', 'logo'],
    isMultiple: true,
  },
  {
    id: '25906326',
    title: 'Lewis Latimer',
    imageUrl: 'https://ext.same-assets.com/2372739326/4231065896.webp',
    likes: 40,
    views: 5300,
    user: mockUsers[7],
    tags: ['illustration', 'line drawing', 'portrait'],
  },
  {
    id: '25905806',
    title: 'Sweden Travel Scenes',
    imageUrl: 'https://ext.same-assets.com/2372739326/2986675534.webp',
    likes: 62,
    views: 7900,
    user: mockUsers.find(u => u.username === 'Pro_Art') || mockUsers[2],
    tags: ['illustration', 'travel', 'sweden', 'scenes']
  },
  {
    id: '25902364',
    title: 'Altitude',
    imageUrl: 'https://ext.same-assets.com/2372739326/4239175326.gif',
    likes: 132,
    views: 20300,
    user: mockUsers.find(u => u.username === 'nathanyoder') || mockUsers[7],
    tags: ['branding', 'identity', 'logo', 'mountains'],
    isAnimated: true,
  },
  {
    id: '25903662-2',
    title: 'Mobile App Design',
    imageUrl: 'https://ext.same-assets.com/2372739326/2063665250.webp',
    likes: 84,
    views: 9500,
    user: mockUsers.find(u => u.username === 'plainthingstudio') || mockUsers[4],
    tags: ['mobile', 'app', 'ui', 'ux', 'design'],
  },
  {
    id: '25903662-3',
    title: 'Typography Exploration',
    imageUrl: 'https://ext.same-assets.com/2372739326/2548307528.webp',
    likes: 55,
    views: 6300,
    user: mockUsers.find(u => u.username === 'teamheyo') || mockUsers[3],
    tags: ['typography', 'type', 'lettering', 'design'],
  },
];

// Trending searches
export const trendingSearches = [
  'landing page',
  'e-commerce',
  'mobile app',
  'logo design',
  'dashboard',
  'icons',
];

// Filter categories
export const filterCategories = [
  { id: 'popular', label: 'Popular' },
  { id: 'new', label: 'New & Noteworthy' },
  { id: 'discover', label: 'Discover' },
  { id: 'animation', label: 'Animation' },
  { id: 'branding', label: 'Branding' },
  { id: 'illustration', label: 'Illustration' },
  { id: 'mobile', label: 'Mobile' },
  { id: 'print', label: 'Print' },
  { id: 'product-design', label: 'Product Design' },
  { id: 'typography', label: 'Typography' },
  { id: 'web-design', label: 'Web Design' },
];
