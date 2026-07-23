'use strict';

const PUBLIC_READ_ACTIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
  'api::homepage.homepage.find',
  'api::testimonial.testimonial.find',
  'api::testimonial.testimonial.findOne',
  'api::order-step.order-step.find',
  'api::order-step.order-step.findOne',
];

async function enablePublicRead(strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const action of PUBLIC_READ_ACTIONS) {
    const existing = await strapi.db
      .query('plugin::users-permissions.permission')
      .findOne({ where: { action, role: publicRole.id } });

    if (!existing) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id, enabled: true },
      });
      continue;
    }

    if (!existing.enabled) {
      await strapi.db.query('plugin::users-permissions.permission').update({
        where: { id: existing.id },
        data: { enabled: true },
      });
    }
  }
}

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    try {
      await enablePublicRead(strapi);
      strapi.log.info('Public read permissions enabled for CMS APIs');
    } catch (error) {
      strapi.log.warn('Could not set public permissions on bootstrap:', error);
    }
  },
};
