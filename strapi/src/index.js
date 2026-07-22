'use strict';

const PUBLIC_PRODUCT_ACTIONS = [
  'api::product.product.find',
  'api::product.product.findOne',
];

async function enablePublicProductRead(strapi) {
  const publicRole = await strapi.db
    .query('plugin::users-permissions.role')
    .findOne({ where: { type: 'public' } });

  if (!publicRole) return;

  for (const action of PUBLIC_PRODUCT_ACTIONS) {
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
      await enablePublicProductRead(strapi);
      strapi.log.info('Public read permissions enabled for Product API');
    } catch (error) {
      strapi.log.warn(
        'Could not set Product public permissions on bootstrap:',
        error
      );
    }
  },
};
