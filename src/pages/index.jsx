import { collection, getDocs } from "firebase/firestore";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import Header from "../components/Header/Header";
import { db } from "../lib/clientApp";
import { query, limit } from "firebase/firestore";
import styles from "../styles/index.module.css";

import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaW51aXl1a2kwOTA0IiwiYSI6ImNsOWlmZXozbTBiNG4zdm1yZHoydWRra2oifQ.92mwSImqwWlQK5_-aIm6rg";

const Home = (props) => {
  const { data } = props;

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(0);
  const [lat, setLat] = useState(0);

  const createMarkerElement = (shop) => {
    let el = document.createElement("div");
    let img = document.createElement("img");

    img.src = `/stores/${shop.brand_name}.png`;
    img.className = styles["pin-img"];

    el.appendChild(img);

    let ptag = document.createElement("p");

    ptag.textContent = shop.brand_price;
    ptag.setAttribute("class", styles["brand-price"]);
    el.appendChild(ptag);
    return el;
  };

  const createHomeMarkerElement = () => {
    let el = document.createElement("div");
    let img = document.createElement("img");

    img.src = "/home_pin.svg";
    img.className = styles["home-pin-img"];
    el.appendChild(img);
    return el;
  };

  const createPopupHTML = (shop) => {
    return `
      <div class="${styles["map-infowindow"]}">
        <div class="shop-title">
          <img src="/stores/${shop.brand_name}.png" width="32px" height="32px" />
          <p class="shop-name">
            <a target="_blank" href="${shop.url}">
              ${shop.store_name}
            </a>
          </p>
        </div>
        <div class="opentime">
          <p>${shop.open_time}</p>
        </div>
        <div class="prices">
          <div>
            <p class="price-popup">¥${shop.brand_price}</p>
          </div>
        </div>
        <a target="_blank" href="https://www.google.com/maps/dir/?api=1&query=${lng},${lat}&destination=${shop.address}&travelmode=driving">
          <button class="btn btn-primary">行き方</button>
        </a>
      </div>`;
  };

  useEffect(() => {
    if (map.current) return;
    // 現在地取得
    navigator.geolocation.getCurrentPosition((position) => {
      setLng(position.coords.longitude);
      setLat(position.coords.latitude);
    });
    (async () => {
      lng &&
        lat &&
        data.map(async (shop) => {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: [lng, lat],
            zoom: 15,
          });
          await new mapboxgl.Marker(createHomeMarkerElement())
            .setLngLat([lng, lat])
            .addTo(map.current);
          await new mapboxgl.Marker(createMarkerElement(shop))
            .setLngLat(shop.longlat)
            .setPopup(
              new mapboxgl.Popup({ offset: [0, -40] }).setHTML(
                createPopupHTML(shop)
              )
            )
            .addTo(map.current);
        });
    })();
  }, [lng, lat]);

  return (
    <div className={styles.container}>
      <Head>
        <title>A Cup of Coffee</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/coffee-pink.png" />
      </Head>
      <div className={styles.map} ref={mapContainer}></div>
    </div>
  );
};

export const getServerSideProps = async () => {
  const ref = collection(db, "stores_tokyo");
  const Docs = await getDocs(query(ref, limit(10)));
  const data = Docs.docs.map((doc) => doc.data());

  const completeData = data.map((shop) => {
    return {
      store_name: shop.store_name || "",
      brand_name: shop.store_brand || "",
      address: shop.address || "",
      open_time: shop.open_time || "",
      brand_item: shop.brand_item || "",
      phone_number: shop.phone || "",
      brand_price: shop.brand_price || 0,
      longlat: [shop.longlat.longitude, shop.longlat.latitude] || [],
    };
  });

  return {
    props: {
      data: completeData,
    },
  };
};

export default Home;
