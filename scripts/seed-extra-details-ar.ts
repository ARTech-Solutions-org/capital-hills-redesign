import { db } from '../server/db/index.js';
import { projects } from '../server/db/schema.js';
import { eq } from 'drizzle-orm';

async function seedExtraDetailsAr() {
  const arabicDetailsMap: Record<string, Record<string, string>> = {
    'la-colina-east': {
      'التشطيب': 'يتم تسليم معظم الوحدات بنصف تشطيب',
      'التصميم المعماري': 'من إبداع استشارات حافظ، مع التركيز على المعمار الحديث وأسلوب الحياة العصري.',
      'التجربة السكنية': 'وجهة معاصرة تجمع بين الموقع الاستراتيجي، والخيارات السكنية المتنوعة، والمساحات المصممة بعناية.'
    },
    'la-colina-west': {
      'الدور الأرضي': 'بنوك + معرض سيارات + صيدليتان + مطاعم وكافيهات + محلات تجزئة + بلازا 14,400 متر',
      'الشقق السكنية': '1 و 2 و 3 غرف نوم (من 100 م² إلى 242 م²)',
      'الدوبلكس': 'مع تراسات خاصة، وسكاي تراس وجاكوزي'
    },
    'park-yard-1': {
      'إدارة المرافق': 'تدار بكل فخر بواسطة أمازون بيلدنجز، المشهود لها بالتميز في إدارة الممتلكات وأعلى المعايير التشغيلية والخدمات السريعة.'
    },
    'park-yard-2': {
      'البدروم': 'جراج سيارات تحت الأرض',
      'الدور الأرضي': 'بنوك + معرض سيارات + صيدليتان + مطاعم وكافيهات + محلات تجزئة + بلازا 14,400 متر',
      'الدور الأول': 'منطقة مطاعم + سينما + منطقة ألعاب + محلات تجزئة',
      'الدور الثاني': 'مكاتب إدارية',
      'الدور الثالث': 'عيادات ومراكز طبية'
    },
    'capital-towers': {
      'إدارة المرافق': 'أنظمة تكييف مركزي – أنظمة متطورة لمكافحة الحرائق – أمن وكاميرات مراقبة – مولدات كهربائية'
    }
  };

  for (const [slug, extraAr] of Object.entries(arabicDetailsMap)) {
    await db.update(projects)
      .set({ extraDetailsAr: extraAr, updatedAt: new Date() })
      .where(eq(projects.slug, slug));
    console.log(`Updated extraDetailsAr for ${slug}`);
  }

  console.log('Finished updating extraDetailsAr in Neon!');
}

seedExtraDetailsAr().catch(console.error);
