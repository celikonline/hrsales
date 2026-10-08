export function createProductAdapter(config) {
  async function call(path, body, accessToken) {
    const response = await fetch(`${config.productApi}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(20000),
    });
    if (!response.ok) throw new Error(`SenseHR bağlantısı başarısız (${response.status}).`);
    return response.json();
  }
  async function platformToken() {
    const login = await call('/v1/identity/auth/login', {
      email: config.platformEmail,
      password: config.platformPassword,
      tenantSlug: 'platform',
    });
    const accessToken = login.tokens?.accessToken;
    if (!accessToken)
      throw new Error(
        'SenseHR servis hesabı giriş yapamadı; platform hesabını ve MFA politikasını kontrol edin.',
      );
    return accessToken;
  }
  return {
    async provision(lead, license) {
      if (config.productMode === 'sandbox')
        return { mode: 'sandbox', tenantId: null, entryUrl: null };
      const names = lead.fullName.split(/\s+/);
      const result = await call(
        '/v1/identity/commercial/provision',
        {
          companyName: lead.company,
          slug: `demo-${lead.id.replaceAll('-', '').slice(0, 24)}`,
          ownerEmail: lead.email,
          ownerFirstName: names[0],
          ownerLastName: names.slice(1).join(' ') || names[0],
          phone: lead.phone,
          license,
        },
        await platformToken(),
      );
      const entryUrl = result.invitationUrl || `${config.productWeb}/login`;
      const url = new URL(entryUrl);
      if (url.origin !== new URL(config.productWeb).origin)
        throw new Error('SenseHR davet adresi beklenen ürün alan adına ait değil.');
      return { mode: 'sensehr', tenantId: result.tenantId, entryUrl, slug: result.slug };
    },
    async updateLicense(lead, license) {
      if (lead.product?.mode !== 'sensehr') return;
      return call(
        `/v1/identity/commercial/${lead.product.tenantId}/license`,
        license,
        await platformToken(),
      );
    },
  };
}
