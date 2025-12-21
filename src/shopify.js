import { createStorefrontApiClient } from "@shopify/storefront-api-client";
import Cache from "@/cache";

export default class Shopify {
  static client;
  static client2;

  static {
    Shopify.client = createStorefrontApiClient({
      apiVersion: "2025-07",
      storeDomain: "thegreymarket-com.myshopify.com",
      publicAccessToken: "fe761087eb282c4486be2893aa0063ae",
    });

    Shopify.client2 = createStorefrontApiClient({
      apiVersion: "2025-07",
      storeDomain: "g59records.indiemerch.com",
      publicAccessToken: "5f0d7c396a7534e562e8da12684e3905",
    });
  }

  static async getProduct(handle, music) {
    const cacheKey = `product:${handle}${music ? ":music" : ""}`;
    const cachedProduct = await Cache.getItem(cacheKey);

    if (cachedProduct) {
      return cachedProduct;
    }

    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `query ProductQuery($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
          descriptionHtml
          sizeChart: metafield(namespace: "custom", key: "size_guide") {
            value
            type
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }`,
      {
        variables: { handle },
      }
    );

    const sizeChart = music ? null : await Shopify.getSizeChart(data.product);

    const product = {
      id: data.product.id,
      handle: data.product.handle,
      title: data.product.title,
      description: data.product.description,
      descriptionHtml: data.product.descriptionHtml,
      images:
        data.product.images?.edges?.length > 0
          ? data.product.images.edges.map(({ node }) => node.url || "")
          : [],
      soldOut: !data.product.variants.edges.some(
        ({ node }) => node.availableForSale
      ),
      price: data.product.priceRange.minVariantPrice.amount,
      currencyCode: data.product.priceRange.minVariantPrice.currencyCode,
      sizeChart,
      variants:
        data.product.variants?.edges?.length > 0
          ? data.product.variants.edges.map(({ node }) => ({
              id: node.id,
              title: node.title,
              availableForSale: node.availableForSale,
            }))
          : [],
    };

    if (product) {
      Cache.setItem(cacheKey, product, 60);
    }

    return product;
  }

  static async getProducts(
    first = 100,
    after = null,
    sortKey = "ID",
    reverse = false,
    music = false
  ) {
    const cacheKey = `products:${first}${after ? `:${after}` : ""}:${sortKey}${
      reverse ? ":reverse" : ""
    }${music ? ":music" : ""}`;

    const cachedProducts = await Cache.getItem(cacheKey);

    if (cachedProducts) {
      return cachedProducts;
    }

    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `query ProductsQuery($first: Int!, $after: String, $sortKey: ProductSortKeys, $reverse: Boolean) {
        products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
              collections(first: 250) {
                edges {
                  node {
                    id
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { first, after, sortKey, reverse },
      }
    );

    const results = data.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale
        );

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.products.pageInfo?.hasNextPage || false;

    const products = {
      results,
      hasMore,
    };

    if (products && products.results && products.results.length > 0) {
      Cache.setItem(cacheKey, products, 120);
    }

    return products;
  }

  static async getSizeChart(product) {
    let sizeChartId =
      product &&
      product.sizeChart &&
      product.sizeChart.value &&
      product.sizeChart.type === "page_reference"
        ? product.sizeChart.value
        : null;

    if (!sizeChartId) {
      return null;
    }

    sizeChartId = sizeChartId.replace("OnlineStorePage", "Page");
    const page = await Shopify.getPage(sizeChartId);

    if (!page) {
      return null;
    }

    const match = page.body.match(/<img[^>]+src=["']([^"']+)["']/);
    const src = match ? match[1] : null;

    return src;
  }

  static async getCart(cartId, music) {
    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `query CartQuery($cartId: ID!) {
        cart(id: $cartId) {
          id
          checkoutUrl
          estimatedCost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      title
                      handle
                    }
                    price {
                      amount
                      currencyCode
                    }
                    image {
                      url
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }`,
      {
        variables: { cartId },
      }
    );

    return data.cart;
  }

  static async isCartValid(cartId, music) {
    try {
      const client = music ? Shopify.client2 : Shopify.client;

      const { data } = await client.request(
        `query CartQuery($cartId: ID!) {
          cart(id: $cartId) {
            id
            checkoutUrl
          }
        }`,
        {
          variables: { cartId },
        }
      );

      return !!(data && data.cart && data.cart.id);
    } catch {
      return false;
    }
  }

  static async createCart(music) {
    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(`
      mutation CreateCart {
        cartCreate {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `);

    return data.cartCreate.cart;
  }

  static async addToCart(cartId, lines, music) {
    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `mutation AddToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lines },
      }
    );

    Cache.setItem(`cartId${music ? "music" : ""}`, cartId, 180);

    return data.cartLinesAdd.cart;
  }

  static async removeFromCart(cartId, lineIds, music) {
    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId, lineIds },
      }
    );

    return data.cartLinesRemove.cart;
  }

  static async updateQuantity(cartId, lineId, quantity, music) {
    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `mutation UpdateCartLineQuantity($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: {
          cartId,
          lines: [{ id: lineId, quantity }],
        },
      }
    );

    return data.cartLinesUpdate.cart;
  }

  static async emptyCart(cart, music) {
    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return;
    }

    const lineIds = cart.lines.edges.map((edge) => edge.node.id);

    const client = music ? Shopify.client2 : Shopify.client;

    await client.request(
      `mutation RemoveFromCart($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            id
            checkoutUrl
            estimatedCost {
              subtotalAmount {
                amount
                currencyCode
              }
              totalAmount {
                amount
                currencyCode
              }
            }
            lines(first: 100) {
              edges {
                node {
                  id
                  quantity
                  merchandise {
                    ... on ProductVariant {
                      id
                      title
                    }
                  }
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }`,
      {
        variables: { cartId: cart.id, lineIds },
      }
    );
  }

  static async getCartItems(cartId, music) {
    const cart = await Shopify.getCart(cartId, music);

    if (
      !cart ||
      !cart.lines ||
      !cart.lines.edges ||
      cart.lines.edges.length === 0
    ) {
      return [];
    }

    return cart.lines.edges.map(({ node }) => {
      const merchandise = node.merchandise;

      return {
        id: node.id,
        quantity: node.quantity,
        variantId: merchandise.id,
        variantTitle: merchandise.title,
        productTitle: merchandise.product.title,
        productHandle: merchandise.product.handle,
        price: merchandise.price.amount,
        image: merchandise.image?.url || "",
      };
    });
  }

  static async getMenu(handle = "main-menu") {
    const cachedMenu = await Cache.getItem(`menu:${handle}`);

    if (cachedMenu) {
      return cachedMenu;
    }

    const { data } = await Shopify.client.request(
      `query MenuQuery($handle: String!) {
      menu(handle: $handle) {
        id
        title
        handle
        items {
          id
          title
          type
          url
          resource {
            ... on Collection {
              id
              handle
              title
              description
              image {
                url
                altText
              }
            }
            ... on Product {
              id
              handle
              title
              description
              featuredImage {
                url
                altText
              }
            }
            ... on Page {
              id
              handle
              title
            }
          }
          items {
            id
            title
            type
            url
            resource {
              ... on Collection {
                id
                handle
                title
                description
                image {
                  url
                  altText
                }
              }
              ... on Product {
                id
                handle
                title
                description
                featuredImage {
                  url
                  altText
                }
              }
              ... on Page {
                id
                handle
                title
              }
            }
          }
        }
      }
    }`,
      {
        variables: { handle },
      }
    );

    if (!data.menu) {
      return null;
    }

    const processMenuItem = (item) => {
      const menuItem = {
        id: item.id,
        title: item.title,
        type: item.type,
        url: item.url,
        items: [],
      };

      if (item.resource) {
        menuItem.resource = {
          id: item.resource.id,
          handle: item.resource.handle,
          title: item.resource.title,
        };

        if (item.type === "COLLECTION" && item.resource.image) {
          menuItem.resource.image = item.resource.image.url;
          menuItem.resource.imageAlt = item.resource.image.altText;
          menuItem.resource.description = item.resource.description;
        } else if (item.type === "PRODUCT" && item.resource.featuredImage) {
          menuItem.resource.image = item.resource.featuredImage.url;
          menuItem.resource.imageAlt = item.resource.featuredImage.altText;
          menuItem.resource.description = item.resource.description;
        }
      }

      if (item.items && item.items.length > 0) {
        menuItem.items = item.items.map(processMenuItem);
      }

      return menuItem;
    };

    const menu = {
      id: data.menu.id,
      title: data.menu.title,
      handle: data.menu.handle,
      items: data.menu.items.map(processMenuItem),
    };

    Cache.setItem(`menu:${handle}`, menu, 120);

    return menu;
  }

  static async getCollectionProducts(collectionId, first = 100, after = null) {
    const cachedProducts = await Cache.getItem(
      `collection:${collectionId}:products:${first}${after ? `:${after}` : ""}`
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query CollectionProductsQuery($collectionId: ID!, $first: Int!, $after: String) {
      collection(id: $collectionId) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }`,
      {
        variables: { collectionId, first, after },
      }
    );

    if (!data.collection) {
      return null;
    }

    const results = data.collection.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale
        );

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.collection.products.pageInfo?.hasNextPage || false;
    const endCursor = data.collection.products.pageInfo?.endCursor || null;

    const collectionProducts = {
      collection: {
        id: data.collection.id,
        title: data.collection.title,
        handle: data.collection.handle,
        description: data.collection.description,
        descriptionHtml: data.collection.descriptionHtml,
        image: data.collection.image?.url || null,
        imageAlt: data.collection.image?.altText || null,
      },
      products: {
        results,
        hasMore,
        endCursor,
      },
    };

    if (collectionProducts && collectionProducts.products.results.length > 0) {
      Cache.setItem(
        `collection:${collectionId}:products:${first}${
          after ? `:${after}` : ""
        }`,
        collectionProducts,
        120
      );
    }

    return collectionProducts;
  }

  static async getCollectionProductsByHandle(
    handle,
    first = 100,
    after = null
  ) {
    const cachedProducts = await Cache.getItem(
      `collection-handle:${handle}:products:${first}${after ? `:${after}` : ""}`
    );

    if (cachedProducts) {
      return cachedProducts;
    }

    const { data } = await Shopify.client.request(
      `query CollectionProductsByHandleQuery($handle: String!, $first: Int!, $after: String) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        image {
          url
          altText
        }
        products(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              variants(first: 25) {
                edges {
                  node {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    availableForSale
                  }
                }
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 3) {
                edges {
                  node {
                    url
                    altText
                  }
                }
              }
            }
          }
        }
      }
    }`,
      {
        variables: { handle, first, after },
      }
    );

    if (!data.collection) {
      return null;
    }

    const results = data.collection.products.edges
      .map(({ node }) => {
        const images =
          node.images?.edges?.length > 0
            ? node.images.edges.map(({ node }) => node.url || "")
            : [];

        const soldOut = !node.variants.edges.some(
          ({ node }) => node.availableForSale
        );

        return {
          id: node.id,
          handle: node.handle,
          title: node.title,
          description: node.description,
          descriptionHtml: node.descriptionHtml,
          images,
          price: node.priceRange.minVariantPrice.amount,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          variants:
            node.variants?.edges?.length > 0
              ? node.variants.edges.map(({ node }) => ({
                  id: node.id,
                  title: node.title,
                  availableForSale: node.availableForSale,
                  price: node.price.amount,
                }))
              : [],
          soldOut,
        };
      })
      .filter(Boolean);

    const hasMore = data.collection.products.pageInfo?.hasNextPage || false;
    const endCursor = data.collection.products.pageInfo?.endCursor || null;

    const collectionProducts = {
      collection: {
        id: data.collection.id,
        title: data.collection.title,
        handle: data.collection.handle,
        description: data.collection.description,
        descriptionHtml: data.collection.descriptionHtml,
        image: data.collection.image?.url || null,
        imageAlt: data.collection.image?.altText || null,
      },
      products: {
        results,
        hasMore,
        endCursor,
      },
    };

    if (collectionProducts && collectionProducts.products.results.length > 0) {
      Cache.setItem(
        `collection-handle:${handle}:products:${first}${
          after ? `:${after}` : ""
        }`,
        collectionProducts,
        120
      );
    }

    return collectionProducts;
  }

  static async getPage(pageId) {
    const cachedPage = await Cache.getItem(`page:${pageId}`);

    if (cachedPage) {
      return cachedPage;
    }

    const { data } = await Shopify.client.request(
      `query PageQuery($pageId: ID!) {
      page(id: $pageId) {
          id
          title
          handle
          body
          bodySummary
          seo {
            title
            description
          }
          createdAt
          updatedAt
        }
      }`,
      {
        variables: { pageId },
      }
    );

    if (!data.page) {
      return null;
    }

    const page = {
      id: data.page.id,
      title: data.page.title,
      handle: data.page.handle,
      body: data.page.body,
      bodySummary: data.page.bodySummary,
      seo: data.page.seo
        ? {
            title: data.page.seo.title || null,
            description: data.page.seo.description || null,
          }
        : null,
      createdAt: data.page.createdAt,
      updatedAt: data.page.updatedAt,
    };

    if (page) {
      Cache.setItem(`page:${pageId}`, page, 120);
    }

    return page;
  }

  static async getPages(first = 100, after = null) {
    const cachedPages = await Cache.getItem(
      `pages:${first}${after ? `:${after}` : ""}`
    );

    if (cachedPages) {
      return cachedPages;
    }

    const { data } = await Shopify.client.request(
      `query PagesQuery($first: Int!, $after: String) {
      pages(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              body
              bodySummary
              seo {
                title
                description
              }
              createdAt
              updatedAt
            }
          }
        }
      }`,
      {
        variables: { first, after },
      }
    );

    if (!data.pages) {
      return { results: [], hasMore: false };
    }

    const results = data.pages.edges
      .map(({ node }) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        body: node.body,
        bodySummary: node.bodySummary,
        seo: node.seo
          ? {
              title: node.seo.title || null,
              description: node.seo.description || null,
            }
          : null,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt,
      }))
      .filter(Boolean);

    const hasMore = data.pages.pageInfo?.hasNextPage || false;
    const endCursor = data.pages.pageInfo?.endCursor || null;

    const pages = {
      results,
      hasMore,
      endCursor,
    };

    if (pages && pages.results && pages.results.length > 0) {
      Cache.setItem(`pages:${first}${after ? `:${after}` : ""}`, pages, 120);
    }

    return pages;
  }

  static async getPolicies() {
    const { data } = await Shopify.client.request(
      `{
        shop {
          privacyPolicy {
            handle
            title
            body
          }
          refundPolicy {
            handle
            title
            body
          }
          shippingPolicy {
            handle
            title
            body
          }
          termsOfService {
            handle
            title
            body
          }
        }
      }`
    );

    return data.shop;
  }

  static async getCollections(first = 100, after = null, music = false) {
    const cacheKey = `collections:${first}${after ? `:${after}` : ""}${
      music ? ":music" : ""
    }`;

    const cachedCollections = await Cache.getItem(cacheKey);

    if (cachedCollections) {
      return cachedCollections;
    }

    const client = music ? Shopify.client2 : Shopify.client;

    const { data } = await client.request(
      `query CollectionsQuery($first: Int!, $after: String) {
        collections(first: $first, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              image {
                url
                altText
              }
              productsCount: metafield(namespace: "shopify", key: "products_count") {
                value
              }
            }
          }
        }
      }`,
      {
        variables: { first, after },
      }
    );

    const results = data.collections.edges
      .map(({ node }) => ({
        id: node.id,
        handle: node.handle,
        title: node.title,
        description: node.description,
        descriptionHtml: node.descriptionHtml,
        image: node.image?.url || null,
        imageAlt: node.image?.altText || null,
        productsCount: node.productsCount?.value
          ? parseInt(node.productsCount.value, 10)
          : 0,
      }))
      .filter(Boolean);

    const hasMore = data.collections.pageInfo?.hasNextPage || false;
    const endCursor = data.collections.pageInfo?.endCursor || null;

    const collections = {
      results,
      hasMore,
      endCursor,
    };

    if (collections.results.length > 0) {
      Cache.setItem(cacheKey, collections, 120);
    }

    return collections;
  }
}
