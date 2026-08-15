export type Article = { title: string; image: string; category: string; date: string }
export const articles: Article[] = [
  { title: 'Listening to Films That Drift', image: '/assets/grain/article-forest.png', category: 'Film', date: 'Aug 12' },
  { title: 'Listening to Films That Drift', image: '/assets/grain/article-grass.png', category: 'Film', date: 'Aug 12' },
  { title: 'Listening to Films That Drift', image: '/assets/grain/article-flowers.png', category: 'Film', date: 'Aug 12' },
  { title: 'Listening to Films That Drift', image: '/assets/grain/article-chair.png', category: 'Film', date: 'Aug 12' },
]
export const cinemaPicks = Array.from({ length: 8 }, () => ({ film: 'Static Bloom', year: '2023', mood: 'Hazy, melancholic', why: 'For the light leaks and long silences' }))
export const vintageObjects = ['vinyl', 'vhs', 'telegram', 'cassette', 'postcard', 'floppy']
