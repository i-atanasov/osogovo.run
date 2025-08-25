import { ProductBoxProps } from "../Components/ProductBox/ProductBox"

export const products: ProductBoxProps[] = [
    {
        distance: 14,
        elevation: '<b>Положителна денивелация:</b> 1100 м',
        name: 'Осогово рън',
        startingPoint: '<b>Старт:</b> пл. Велбъжд, гр. Кюстендил',
        final: '<b>Финал:</b> х. Осогово',
        startingTime: '<b>Стартово време:</b> 9:00',
        totalDistance: '<b>Обща дистанция:</b> 14 км',
        cutOffTime: '<b>Контролно време:</b> 12:30',
        description: 'Осогово рън е състезание по планинско бягане, което се провежда в Осоговската планина. Състезанието предлага различни дистанции и маршрути, които преминават през живописни пейзажи и предизвикателни терени.',
        image: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/OSOGOVO-RUN-14k.png',
        gpx: '/gpx/osogovo-run.gpx',
        price: 30,
        latePrice: 40,
        priceLabel: '<b>Такса:</b> 30 лв (до 15 септември)',
        latePriceLabel: '<b>Такса:</b> 40 лв (след 15 септември)',
    },
    {
        distance: 26,
        elevation: '<b>Положителна денивелация:</b> 1700 м',
        name: 'Осогово ултрамаратон',
        startingPoint: '<b>Старт:</b> пл. Велбъжд, гр. Кюстендил',
        final: '<b>Финал:</b> вр. Руен',
        startingTime: '<b>Начало:</b> 09:00',
        totalDistance: '<b>Обща дистанция:</b> 26 км',
        cutOffTime: '<b>Контролно време:</b> 14:30',
        description: 'Руен рън е предизвикателство за опитни бегачи, които искат да се изправят пред дълги дистанции и трудни условия в Осоговската планина. Състезанието предлага уникален опит и възможност за преодоляване на собствените граници.',
        image: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/OSOGOVO-RUN-26k.png',
        gpx: '/gpx/osogovo-ultramarathon.gpx',
        price: 40,
        latePrice: 50,
        priceLabel: '<b>Такса:</b> 40 лв (до 15 септември)',
        latePriceLabel: '<b>Такса:</b> 50 лв (след 15 септември)',
    },
]

export const CourseDescription = {
    title: 'Трасе',
    description: 'Старт на площад Велбъжд в центъра на Кюстендил (530м Н.В.), преминава покрай стадиона, картинг пистата и Почивало, по горски път под х. Иглика до Студен кладенец. Преди м. Памука излиза на асфалтовия път и след 2км достига х. Осогово, откъдето връх Руен се изкачва през Бегбунар по лятната пътека на централното било (червена маркировка). Връщането от върха до хижата е на собствен ход. откъдето е осигурено извозване до града.',
}

export const colors = {
    RuenOrange: `#ef5223`,
    OsogovoBlack: `#30332F`
}

export const details = {
    conditionsTitle: 'Условия за участие',
    conditions: 'Неограничено, за физически и психически здрави хора от 15 до 75-годишна възраст. Участниците се задължават да се движат по маркировката и да спазват Закона за движение по пътищата преди, по време и след състезанието. Непредставилите на регистрацията предсъстезателен преглед стартират на собствена отговорност. Разходите по участието са за сметка на участниците. Носенето на лична карта за участниците на дългата дистанция по време на състезанието е задължително поради навлизане в гранична зона!',
    programTitle: 'Програма за състезателния ден',
    programRegistration: '<b>8:00-8:45 ч.</b> Регистрация за участие в зоната на старта',
    programStart: '<b>9:00 ч.</b> СТАРТ на всички дистанции',
    programEnd: '<b>14:30 ч.</b> затваряне на ФИНАЛА',
    transportTitle: 'Транспорт',
    transportFinish: '<b>Извозване след финиширане:</b> от паркинга при хижа Осогово с автобус до старта. Първи курс след 13:00 часа при запълване на местата.',
    transportLuggage: '<b>Транспортиране на багаж:</b> осигурено е транспортиране на багаж на участниците от старта до финала. Същият трябва да бъде предаден на организаторите до 8:50 часа в деня на старта.',
    raceDirPhone: '0885 219 269',
    raceDirEmail: 'info@osogovo.run'
}

export const fullRoute = `
    <svg id="e8YbCgxFQ5K1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1606 620" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" project-id="79b558f0b7014ed184d6cfcf6f896270" export-id="a5f067ccb306402d892b4c2beacffe2c" cached="false" width="auto" height="auto"><path d="M0,599.584502l28.588482,1.681676l11.771727-6.726702h20.180104h10.090051l13.453404-3.363351h16.816754l23.543455-16.816753l20.180104-5.045027l13.453402-5.045027l13.453403-5.045026h21.86178l16.816754-15.135078l15.135079-10.090053l13.453403-1.681675l35.315183-15.135079l15.135079-16.816754h15.135078l6.726702-10.090052l6.726701-10.090052l15.135079-10.090053l16.816754-3.363351l18.498429-13.453403l15.135079-3.36335l11.771727-6.726702l16.816754-8.408377L422.10052,421.32691l13.453403-1.681676l16.816754-7.063036l15.135078-14.798744h8.408377h10.090052h18.49843l16.816754-10.090052c0,0,8.151546,3.757931,11.771727,5.045026c3.460623,1.230367,11.771728,3.363351,11.771728,3.363351l20.180105-3.363351l15.135078-8.408377l16.816754-6.726701h10.090053l13.453403,6.726701l21.86178-5.045026h21.86178l18.498429-3.363351l23.543456-15.135078l31.951832-8.408377L765.1623,337.24314l23.543455-3.363351l28.588482-1.681675h18.498429h25.225131l21.86178-5.045026l15.135079-5.045026l16.816754,3.36335h10.090052h18.498429l13.453403-1.681675l16.816754-3.363351l28.588482-10.426387h10.090052h13.453404h23.543455l20.180105-13.117068l11.771727,1.681675h16.816754l11.771728-1.681675l18.498429-5.045026h13.453404l15.135078-1.681676h10.090053l16.816753-10.090052l11.771728-1.681676h18.49843h13.453403h16.816754h10.090052l13.453403-5.045026l15.135079-5.045026l11.771727-6.726701l15.135079-10.090053l15.135078-6.726701l20.180105-16.816754h10.090052h10.090053l20.180105-5.045026l15.135078,3.36335l25.225131-5.045026l11.771728-5.045026l20.180104-5.045026h16.816754l16.816754-8.408377l15.135079-6.726702l13.453403-3.363351l8.408377-8.408377h10.090052l20.180105-5.045026l10.090052-5.045026h11.771728h11.771728l13.453403-6.726701" transform="translate(.000004 0.000001)" fill="none" stroke="#ef5223" stroke-width="3.212" class="svg-elem-1"></path>
    <path d="M244.862827,230.995309v14.389193v11.771727v1.681676v0v0v5.045026v1.681675v0v0v0v5.391716v6.043677v5.381152v5.045235v3.363351v1.681675v1.681676v0v0v5.045026" transform="matrix(-1 0 0 1.953376 1089.725654-264.157387)" fill="none" stroke="#fff" stroke-width="3.212" class="svg-elem-2"></path>
    <path d="M-110.862827,205.995309v14.389193v11.771727v1.681676v0v0v5.045026v1.681675v0v0v0v5.391716v6.043677v5.381152v5.045235v3.363351v1.681675v1.681676v0v0v5.045026" transform="matrix(-1 0 0 1.953376 1089.725654-264.157387)" fill="none" stroke="#ef5223" stroke-width="3.212" class="svg-elem-5"></path>
    <path d="M-514.862827,145.995309v14.389193v11.771727v1.681676v0v0v5.045026v1.681675v0v0v0v5.391716v6.043677v5.381152v5.045235v3.363351v1.681675v1.681676v0v0v5.045026" transform="matrix(-1 0 0 1.953376 1089.725654-264.157387)" fill="none" stroke="#fff" stroke-width="3.212" class="svg-elem-7"></path>
    <path d="M544.862827,263.995309v14.389193v11.771727v1.681676v0v0v5.045026v1.681675v0v0v0v5.391716v6.043677v5.381152v5.045235v3.363351v1.681675v1.681676v0v0v5.045026" transform="matrix(-1 0 0 1.953376 1089.725654-264.157387)" fill="none" stroke="#ef5223" stroke-width="3.212" class="svg-elem-8"></path>
    <style>
    @font-face {font-family: 'e8YbCgxFQ5K1:::Roboto';font-style: normal;font-weight: 400;font-stretch: normal;src: url(data:font/ttf;charset=utf-8;base64,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) format('truetype');}
    </style>
    </svg>
`

export const sponsors = [
    {
        name: 'Община Кюстендил',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/kn-logo.png',
        url:  'https://www.kustendil.bg/'
    },
    {
        name: 'ТД Осогово',
        logo: 'https://www.td-osogovo.org/images/yootheme/logo.png',
        url:  'https://www.td-osogovo.org/'
    },
    {
        name: 'Roobar',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/roobar.svg',
        url:  'https://smartorganic.com/roobar/'
    },
    {
        name: 'IDCSoft',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/icdsoft.svg',
        url:  'https://www.icdsoft.com/'
    },
    {
        name: 'GO RUN',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/go-run.png',
        url:  'https://gorun-shop.com/'
    },
    {
        name: 'Община Кюстендил',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/kn-logo.png',
        url:  'https://www.kustendil.bg/'
    },
    {
        name: 'ТД Осогово',
        logo: 'https://www.td-osogovo.org/images/yootheme/logo.png',
        url:  'https://www.td-osogovo.org/'
    },
    {
        name: 'Roobar',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/roobar.svg',
        url:  'https://www.roobar.bg/'
    },
    {
        name: 'IDCSoft',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/icdsoft.svg',
        url:  'https://www.icdsoft.com/'
    },
    {
        name: 'GO RUN',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/go-run.png',
        url:  'https://gorun-shop.com/'
    },
    {
        name: 'Община Кюстендил',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/kn-logo.png',
        url:  'https://www.kustendil.bg/'
    },
    {
        name: 'ТД Осогово',
        logo: 'https://www.td-osogovo.org/images/yootheme/logo.png',
        url:  'https://www.td-osogovo.org/'
    },
    {
        name: 'Roobar',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/roobar.svg',
        url:  'https://www.roobar.bg/'
    },
    {
        name: 'IDCSoft',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/icdsoft.svg',
        url:  'https://www.icdsoft.com/'
    },
    {
        name: 'GO RUN',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/go-run.png',
        url:  'https://gorun-shop.com/'
    },
    {
        name: 'Община Кюстендил',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/kn-logo.png',
        url:  'https://www.kustendil.bg/'
    },
    {
        name: 'ТД Осогово',
        logo: 'https://www.td-osogovo.org/images/yootheme/logo.png',
        url:  'https://www.td-osogovo.org/'
    },
    {
        name: 'Roobar',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/roobar.svg',
        url:  'https://www.roobar.bg/'
    },
    {
        name: 'IDCSoft',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/icdsoft.svg',
        url:  'https://www.icdsoft.com/'
    },
    {
        name: 'GO RUN',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/go-run.png',
        url:  'https://gorun-shop.com/'
    },
    {
        name: 'Община Кюстендил',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/kn-logo.png',
        url:  'https://www.kustendil.bg/'
    },  
    {
        name: 'ТД Осогово',
        logo: 'https://www.td-osogovo.org/images/yootheme/logo.png',
        url:  'https://www.td-osogovo.org/'
    },  
    {
        name: 'Roobar',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/roobar.svg',
        url:  'https://www.roobar.bg/'
    },
    {
        name: 'IDCSoft',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/icdsoft.svg',
        url:  'https://www.icdsoft.com/'
    },
    {
        name: 'GO RUN',
        logo: 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/go-run.png',
        url:  'https://gorun-shop.com/'
    },
]