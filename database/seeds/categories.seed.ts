import { createSeedClient } from '@snaplet/seed';

const CATEGORIES = [
  { name: 'Technology' },
  { name: 'Healthcare' },
  { name: 'Finance' },
  { name: 'Education' },
  { name: 'Marketing' },
  { name: 'Sales' },
  { name: 'Customer Service' },
  { name: 'Human Resources' },
  { name: 'Operations' },
  { name: 'Legal' },
  { name: 'Consulting' },
  { name: 'Manufacturing' },
  { name: 'Retail' },
  { name: 'Transportation' },
  { name: 'Real Estate' },
  { name: 'Media & Entertainment' },
  { name: 'Non-profit' },
  { name: 'Government' },
  { name: 'Research & Development' },
  { name: 'Other' },
];

const SUB_CATEGORIES = [
  { name: 'Software Development', categoryName: 'Technology' },
  { name: 'Data Science', categoryName: 'Technology' },
  { name: 'DevOps', categoryName: 'Technology' },
  { name: 'Cybersecurity', categoryName: 'Technology' },
  { name: 'Mobile Development', categoryName: 'Technology' },
  { name: 'Web Development', categoryName: 'Technology' },
  { name: 'AI/ML', categoryName: 'Technology' },
  { name: 'Cloud Computing', categoryName: 'Technology' },

  { name: 'Nursing', categoryName: 'Healthcare' },
  { name: 'Physician', categoryName: 'Healthcare' },
  { name: 'Pharmacy', categoryName: 'Healthcare' },
  { name: 'Mental Health', categoryName: 'Healthcare' },
  { name: 'Physical Therapy', categoryName: 'Healthcare' },
  { name: 'Medical Research', categoryName: 'Healthcare' },

  { name: 'Investment Banking', categoryName: 'Finance' },
  { name: 'Accounting', categoryName: 'Finance' },
  { name: 'Financial Planning', categoryName: 'Finance' },
  { name: 'Insurance', categoryName: 'Finance' },
  { name: 'Fintech', categoryName: 'Finance' },
  { name: 'Audit', categoryName: 'Finance' },

  { name: 'Teaching', categoryName: 'Education' },
  { name: 'Administration', categoryName: 'Education' },
  { name: 'Curriculum Development', categoryName: 'Education' },
  { name: 'Student Services', categoryName: 'Education' },
  { name: 'Online Education', categoryName: 'Education' },

  { name: 'Digital Marketing', categoryName: 'Marketing' },
  { name: 'Content Marketing', categoryName: 'Marketing' },
  { name: 'Social Media Marketing', categoryName: 'Marketing' },
  { name: 'SEO/SEM', categoryName: 'Marketing' },
  { name: 'Brand Management', categoryName: 'Marketing' },
  { name: 'Market Research', categoryName: 'Marketing' },

  { name: 'Inside Sales', categoryName: 'Sales' },
  { name: 'Outside Sales', categoryName: 'Sales' },
  { name: 'Sales Management', categoryName: 'Sales' },
  { name: 'Account Management', categoryName: 'Sales' },
  { name: 'Business Development', categoryName: 'Sales' },

  { name: 'Technical Support', categoryName: 'Customer Service' },
  { name: 'Customer Success', categoryName: 'Customer Service' },
  { name: 'Call Center', categoryName: 'Customer Service' },
  { name: 'Customer Experience', categoryName: 'Customer Service' },

  { name: 'Recruitment', categoryName: 'Human Resources' },
  { name: 'Talent Management', categoryName: 'Human Resources' },
  { name: 'Compensation & Benefits', categoryName: 'Human Resources' },
  { name: 'Employee Relations', categoryName: 'Human Resources' },
  { name: 'Training & Development', categoryName: 'Human Resources' },

  { name: 'Supply Chain', categoryName: 'Operations' },
  { name: 'Logistics', categoryName: 'Operations' },
  { name: 'Quality Assurance', categoryName: 'Operations' },
  { name: 'Process Improvement', categoryName: 'Operations' },
  { name: 'Project Management', categoryName: 'Operations' },

  { name: 'Corporate Law', categoryName: 'Legal' },
  { name: 'Criminal Law', categoryName: 'Legal' },
  { name: 'Family Law', categoryName: 'Legal' },
  { name: 'Intellectual Property', categoryName: 'Legal' },
  { name: 'Real Estate Law', categoryName: 'Legal' },

  { name: 'Management Consulting', categoryName: 'Consulting' },
  { name: 'IT Consulting', categoryName: 'Consulting' },
  { name: 'Strategy Consulting', categoryName: 'Consulting' },
  { name: 'Financial Consulting', categoryName: 'Consulting' },

  { name: 'Production', categoryName: 'Manufacturing' },
  { name: 'Quality Control', categoryName: 'Manufacturing' },
  { name: 'Maintenance', categoryName: 'Manufacturing' },
  { name: 'Engineering', categoryName: 'Manufacturing' },

  { name: 'Store Management', categoryName: 'Retail' },
  { name: 'E-commerce', categoryName: 'Retail' },
  { name: 'Merchandising', categoryName: 'Retail' },
  { name: 'Visual Merchandising', categoryName: 'Retail' },

  { name: 'Logistics', categoryName: 'Transportation' },
  { name: 'Fleet Management', categoryName: 'Transportation' },
  { name: 'Supply Chain', categoryName: 'Transportation' },
  { name: 'Warehouse Management', categoryName: 'Transportation' },

  { name: 'Residential', categoryName: 'Real Estate' },
  { name: 'Commercial', categoryName: 'Real Estate' },
  { name: 'Property Management', categoryName: 'Real Estate' },
  { name: 'Development', categoryName: 'Real Estate' },

  { name: 'Content Creation', categoryName: 'Media & Entertainment' },
  { name: 'Journalism', categoryName: 'Media & Entertainment' },
  { name: 'Film & TV', categoryName: 'Media & Entertainment' },
  { name: 'Gaming', categoryName: 'Media & Entertainment' },
  { name: 'Music', categoryName: 'Media & Entertainment' },

  { name: 'Fundraising', categoryName: 'Non-profit' },
  { name: 'Program Management', categoryName: 'Non-profit' },
  { name: 'Advocacy', categoryName: 'Non-profit' },
  { name: 'Volunteer Management', categoryName: 'Non-profit' },

  { name: 'Public Policy', categoryName: 'Government' },
  { name: 'Public Administration', categoryName: 'Government' },
  { name: 'Law Enforcement', categoryName: 'Government' },
  { name: 'Diplomacy', categoryName: 'Government' },

  { name: 'Product Development', categoryName: 'Research & Development' },
  { name: 'Scientific Research', categoryName: 'Research & Development' },
  { name: 'Innovation', categoryName: 'Research & Development' },
  { name: 'Laboratory Research', categoryName: 'Research & Development' },
];

const main = async () => {
  const shouldReset = process.argv.includes('--reset');
  const shouldDryRun = process.argv.includes('--dry-run');
  const seed = await createSeedClient({ dryRun: shouldDryRun || false });

  if (shouldReset) {
    await seed.$resetDatabase(['public.sub_category', 'public.category']);
  }

  const categories = await seed.category(CATEGORIES.map((category) => ({ name: category.name })));

  await seed.sub_category(
    SUB_CATEGORIES.map((subCategory) => ({
      name: subCategory.name,
      category_id: categories.category.find((c) => c.name === subCategory.categoryName)?.id,
    })),
  );

  process.exit();
};

main();
