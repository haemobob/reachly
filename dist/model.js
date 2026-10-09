export const services = [
  { name: 'Website design & development', caption: '01 / THE DIGITAL HOME', title: 'A website that earns a second look.', description: 'Business websites, landing pages, and redesigns with thoughtful visuals, clear content, and an easy path to an inquiry.', tags: ['Responsive design', 'Clear content', 'Inquiry paths'], goal: 'A new website' },
  { name: 'Digital presence', caption: '02 / A CONNECTED PRESENCE', title: 'Every touchpoint, on the same page.', description: 'Consistent business information, visual direction, and connections between your website and relevant channels. One business, a coherent online presence.', tags: ['Profile consistency', 'Business information', 'Connected channels'], goal: 'Digital presence' },
  { name: 'Digital strategy', caption: '03 / A CLEARER DIRECTION', title: 'Know what to do next — and why.', description: 'We clarify goals, customer journeys, priorities, and appropriate tools, then turn them into a practical digital roadmap.', tags: ['Business goals', 'Customer journeys', 'Actionable roadmap'], goal: 'Digital strategy' },
  { name: 'Business automation', caption: '04 / LESS REPETITIVE WORK', title: 'Let the tools carry more of the work.', description: 'Agreed workflows for inquiry capture, form routing, customer records, and routine notifications. Integrations and support are scoped to your business.', tags: ['Workflow planning', 'Connected tools', 'Agreed integrations'], goal: 'Business automation' },
  { name: 'SEO', caption: '05 / STRONGER SEARCH FOUNDATIONS', title: 'Make your business easier to discover.', description: 'Foundational technical and on-page SEO, metadata, page structure, and visibility planning. Local search support where agreed, with no ranking or traffic guarantees.', tags: ['Technical foundations', 'On-page structure', 'Local search planning'], goal: 'SEO' }
];
export const processStages = ['Discover', 'Plan', 'Create', 'Launch', 'Improve'];
export const motionLimits = { drift: 18, tilt: 10 };
export function pointerPose(x, y) {
  const distance = Math.hypot(x, y);
  const scale = distance > motionLimits.drift ? motionLimits.drift / distance : 1;
  return { x: x * scale, y: y * scale, rotateX: clamp(-y / 100, -1, 1) * motionLimits.tilt, rotateY: clamp(x / 100, -1, 1) * motionLimits.tilt };
}
export const concepts = [
  { image: 'assets/coffee.jpg', alt: 'Coffee being prepared at a café', brand: 'KOPI / KITA', headline: 'A little cup<br>of <em>good.</em>', link: 'YOUR EVERYDAY RITUAL ↗', category: 'FOOD & BEVERAGE', name: 'Local roots. A fresh look.', description: 'Warm colours, generous photography, and a little character. An online home that feels like walking into your favourite café.', hero: 'A little<br>cup of<br><em>good.</em>', background: '#f0eedc', ink: '#26382b', eyebrow: 'YOUR EVERYDAY RITUAL.' },
  { image: 'assets/flowers.jpg', alt: 'Delicate white flowers in a spring arrangement', brand: 'flora ✳', headline: 'Made for<br><em>your moment.</em>', link: 'FLOWERS WITH FEELING ↗', category: 'FLOWERS & GIFTING', name: 'A softer kind of standout.', description: 'An expressive, personal storefront with beautiful arrangements front and centre. A considered way to help someone find just the right gesture.', hero: 'Made for<br>your<br><em>moment.</em>', background: '#f7e4de', ink: '#763626', eyebrow: 'FLOWERS WITH FEELING.' },
  { image: 'assets/interior.jpg', alt: 'A warm living space with thoughtfully selected furniture', brand: 'COMMON GROUND.', headline: 'Room for<br><em>better living.</em>', link: 'THOUGHTFUL SPACES ↗', category: 'INTERIORS & PROFESSIONAL SERVICES', name: 'Space to show your expertise.', description: 'A quiet, confident portfolio that lets the details speak. Clear services and a thoughtful inquiry path make the next conversation feel easy.', hero: 'Room for<br>better<br><em>living.</em>', background: '#e8e3d8', ink: '#27342e', eyebrow: 'THOUGHTFUL SPACES.' }
];
export function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
export function buildBrief(data) {
  const goals = data.goals?.length ? data.goals.join(', ') : 'To be discussed';
  return `REACHLY — PROJECT BRIEF\n\nName: ${data.name.trim()}\nBusiness: ${data.business.trim()}\nEmail: ${data.email.trim()}\n\nInterested in: ${goals}\n\nAbout the project:\n${data.message.trim()}\n\nPrepared with Reachly’s project planner.\nThis brief has not been submitted.\n`;
}
