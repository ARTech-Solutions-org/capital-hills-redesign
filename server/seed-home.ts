import { db } from './db';
import { contentBlocks } from './db/schema';

async function seedHome() {
  try {
    console.log('Seeding home defaults...');
    
    const defaultContent = [
      { id: 'home_why_1_title', value: 'Trusted Relationships' },
      { id: 'home_why_1_copy', value: 'Creating spaces where people can live, work, grow, and connect.' },
      { id: 'home_why_2_title', value: '18 Key Projects' },
      { id: 'home_why_2_copy', value: 'Serving residential, commercial & mixed-use across Egypt.' },
      { id: 'home_why_3_title', value: 'Established Partners' },
      { id: 'home_why_3_copy', value: 'Working with brands across industries to deliver lasting value.' },
      { id: 'home_why_4_title', value: 'People at the Heart' },
      { id: 'home_why_4_copy', value: 'A collaborative team committed to making a meaningful impact.' },
      
      { id: 'home_reviews_list', value: JSON.stringify([
        {
          quote: 'The attention to detail and commitment to quality is evident in every aspect of the project. A truly reliable partner.',
          name: 'Ahmed Youssef',
          detail: 'Business Owner / Resident'
        },
        {
          quote: 'Capital Hills provided us with a seamless experience from start to finish. Their transparency is unmatched.',
          name: 'Sarah Mahmoud',
          detail: 'Investor'
        },
        {
          quote: 'We found exactly what we were looking for. The design and community feel are truly exceptional.',
          name: 'Omar & Laila',
          detail: 'Homeowners'
        }
      ])},
      
      { id: 'chairman_stat_1_val', value: '10+' },
      { id: 'chairman_stat_1_lbl', value: 'Years of trust' },
      { id: 'chairman_stat_2_val', value: '11' },
      { id: 'chairman_stat_2_lbl', value: 'Landmark projects' },
      { id: 'chairman_stat_3_val', value: '100B+' },
      { id: 'chairman_stat_3_lbl', value: 'EGP investments' },
      
      { id: 'home_partners_list', value: JSON.stringify([
        { src: '/logos/amazon.png', alt: 'Amazon Hills', desc: "The meeting point of two ambitious visions: Capital Hills' local insight and Amazon Developments' global excellence. Through this collaboration, we deliver high-rise mixed-use destinations defined by precision, smart engineering, and modern architecture — setting new benchmarks for real estate in Egypt's New Administrative Capital and beyond." },
        { src: '/logos/e_and_egypt.png', alt: 'Etisalat and (e&)', desc: 'A leading regional provider of communications and digital services, partnering with us to redefine the concept of gated communities in Egypt. Through this collaboration, we integrate advanced infrastructure, smart services, and cutting-edge technology into our projects, delivering a new benchmark for connected, intelligent living.' },
        { src: '/logos/fbc.png', alt: 'Future Builders Company', desc: 'A trusted execution partner bringing engineering excellence, precision, and timely delivery to Capital Hills\' ambitious visions. Together, we integrate the mindset of a developer and contractor into one unified approach, ensuring projects are built to exacting standards while maintaining speed, quality, and client satisfaction.' },
        { src: '/logos/arkan.png', alt: 'Arkan Consultants', desc: 'A multidisciplinary consultancy partner providing integrated engineering and architectural solutions. Arkan Consultants bring technical rigor, coordination efficiency, and modern design thinking, ensuring Capital Hills\' projects meet high performance standards while maintaining architectural integrity.' },
        { src: '/logos/archplan.png', alt: 'Archplan Consulting', desc: 'A strategic architectural and planning partner contributing design clarity, spatial intelligence, and regulatory expertise to Capital Hills\' developments. Through thoughtful planning and coordinated execution, Archplan supports the delivery of well-structured projects that balance functionality, aesthetics, and long-term value.' },
        { src: '/logos/dma.png', alt: 'DMA Design | Engineering', desc: 'A trusted engineering partner delivering precise structural and technical solutions across Capital Hills\' portfolio. DMA\'s expertise ensures stability, efficiency, and compliance at every stage of development, supporting projects that are engineered to perform, endure, and scale.' },
        { src: '/logos/iec.png', alt: 'IEC', desc: 'A reliable engineering consultancy offering comprehensive design, supervision, and coordination services. IEC plays a key role in aligning technical execution with Capital Hills\' development vision, ensuring projects are delivered with accuracy, safety, and operational efficiency.' },
        { src: '/logos/adc.png', alt: 'ADC', desc: 'A creative architectural partner bringing contemporary design approaches and contextual sensitivity to Capital Hills\' developments. ADC contributes innovative concepts that enhance user experience while maintaining practicality, efficiency, and alignment with the overall project vision.' },
        { src: '/logos/hafez.png', alt: 'Hafez Consultants', desc: 'A leading architectural and urban design partner shaping the identity of several Capital Hills projects. With a strong focus on modern architecture, spatial harmony, and lifestyle integration, Hafez Consultants translate development vision into refined, livable environments built to stand the test of time.' },
        { src: '/logos/yba.png', alt: 'YBA Architects', desc: 'An architectural partner delivering elegant, functional, and well-coordinated design solutions. YBA Architects support Capital Hills by ensuring architectural consistency, clarity of execution, and thoughtful detailing across residential and mixed-use developments.' },
        { src: '/logos/ace.png', alt: 'ACE Bakhoum & Partners', desc: 'ACE is a leading multidisciplinary engineering consultancy providing comprehensive services in planning, design, project management, and construction supervision. With a multidisciplinary team and a global approach, ACE delivers tailored human and technical solutions to meet the unique requirements of every project.' },
        { src: '/logos/sag.png', alt: 'SAG Consulting Group', desc: 'SAG Consulting Group is a multidisciplinary engineering consultancy with over 30 years of experience in design, construction supervision, project management, and technical support. With a strong track record across Egypt, Africa, and the Middle East, SAG has successfully delivered landmark and large scale projects across a wide range of sectors.' },
        { src: '/logos/regus.png', alt: 'Regus', desc: 'Regus, part of International Workplace Group (IWG), is a globally recognized provider of flexible workspace solutions, offering premium serviced offices, coworking spaces, meeting rooms, and business services. Founded in 1989 in Brussels, Regus has built a strong international presence, delivering professional workplace environments designed to support business growth and productivity.' },
        { src: '/logos/raa.png', alt: 'RAYA Smart Buildings', desc: 'RAYA Smart Buildings specializes in developing smart, sustainable, and sophisticated commercial and office spaces, combining innovative design, energy efficiency, and technology to create high-quality business environments.' },
        { src: '/logos/electra.png', alt: 'Electra', desc: 'Electra by Raya provides smart and sustainable EV charging solutions, making electric mobility more accessible, convenient, and connected.' },
        { src: '/logos/healthy.png', alt: 'Healthy Care Medical Group', desc: 'Established in 2018, Healthy Care Medical Group is a leading Egyptian healthcare provider offering specialized medical services across multiple disciplines. Starting with a specialized polyclinic in Alexandria, the group has expanded its presence and obtained medical operator licenses for several projects in the New Administrative Capital, bringing integrated healthcare expertise to emerging communities.' },
      ])}
    ];
    
    for (const block of defaultContent) {
      await db.insert(contentBlocks).values(block).onConflictDoUpdate({
        target: contentBlocks.id,
        set: { value: block.value }
      });
    }
    
    console.log('Done!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seedHome();
