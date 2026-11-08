// INTERNAL key bot — CommonJS (pkg-compatible)
const {
    Client, Events, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ButtonStyle,
    ActionRowBuilder, PermissionFlagsBits: P, ChannelType, OverwriteType, MessageFlags,
    REST, Routes, SlashCommandBuilder, InteractionContextType,
} = require('discord.js');
const { readFileSync, writeFileSync, existsSync } = require('fs');
const path = require('path');

// ── load .env ─────────────────────────────────────────────────────────────────
const ENV_PATH = path.join(path.dirname(process.pkg ? process.execPath : __filename), '.env');
if (existsSync(ENV_PATH)) {
    for (const line of readFileSync(ENV_PATH, 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+)$/);
        if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    }
}

const TOKEN     = process.env.BOT_TOKEN || 'MTU2ODY3ODQ1NDEwMTI4Mjg2Ng.GT8-nc.j-Wqhh5MMbIWfnLeaRrNZdQcKSyMB8i4CuIFSw';
const CLIENT_ID = process.env.CLIENT_ID || '1568678454101282866';
const GUILD_ID  = process.env.GUILD_ID  || '1569032040559419512';

if (!TOKEN || !GUILD_ID) {
    console.error('[INTERNAL] Fill in BOT_TOKEN and GUILD_ID in .env — see README.');
    process.exit(1);
}

const kHardenEveryone = true;
const kGrantOnKey     = true;
const kLogKeyClaims   = true;

// ── auto-deploy slash commands ────────────────────────────────────────────────
const DEPLOY_FLAG = path.join(path.dirname(process.pkg ? process.execPath : __filename), '.deployed');
async function deployCommands() {
    const commands = [
        new SlashCommandBuilder().setName('setup')
            .setDescription('Create/repair roles, channels, permissions and info messages (admin)')
            .setDefaultMemberPermissions(P.Administrator)
            .setContexts(InteractionContextType.Guild).toJSON(),
        new SlashCommandBuilder().setName('post')
            .setDescription('Post key embed (admin)')
            .setDefaultMemberPermissions(P.Administrator)
            .setContexts(InteractionContextType.Guild)
            .addChannelOption(o => o.setName('channel').setDescription('Target channel')
                .addChannelTypes(ChannelType.GuildText).setRequired(false)).toJSON(),
    ];
    const rest = new REST({ version: '10' }).setToken(TOKEN);
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: commands });
    writeFileSync(DEPLOY_FLAG, '1');
    console.log('[INTERNAL] slash commands registered — /setup and /post are ready');
}

// ── Key vault ─────────────────────────────────────────────────────────────────
const VAULT = [
    "RESERVED_INDEX_0_DO_NOT_USE_xxxxxxxxxxxxxxxxxxx",
    "4mFxGqGNfxiHOVYRiHZ0eQhAuqZDy77JtJKtIReR",
    "h1ucZ2OPfxSExIkvaxF7qAJQ0VMjB8LTz10mpPZc",
    "Ok2tIFNtCjlxKWLGjlxoiHqGgMyY4If4lhUfPiT9",
    "iEROqLWSi7eb5d1RxYzH07Q2VD91d5VBQyzZTBRl",
    "RZVk7uQyHS2oWzDXqHAWdmJvshmHdgmb1cFvnl8q",
    "L92vfpLr4aJRViDJGrEBUuK8ZkW0lxHAkMLhnsna",
    "VZ0iebOMDufoo8NpoDSMpBxmEvJuD4MSExJhDfRg",
    "PbWMfLprUjBm3JxY5QmLRlxtIHv4o3o3JmabsytV",
    "XfB2WEmrAM54lF65lAe7uhWVTLnDaSFzrhajS1PQ",
    "JEIFV4PVLW943xm344VjSSLi69AamaKGMtkOAHDe",
    "hyySE3r9YymM9GPE6j1GO4XJ3jy4AUmJ9F4jlQmd",
    "aI53MqrckXK2rAlnBl1CdTTWoUmuz5Xu7ia8XX7d",
    "ckFQecFWUv4Gga1ZjzBvAaLdtxZgySIfiUznE97e",
    "ZhlL2932RSNG1jQKnqGo2MSVYyPbsDsANkT5fYUI",
    "3n4xlz2LG3DLgUmwc16bDfUu8wft2HckQKemEVgp",
    "s5yiYcrPBm7ncSCIUF1RHx2rRvPbpPNtkybwAYk4",
    "lTweMNKAnCkGP0k1A2T17PTEqy3vWdBYvkP7dNXc",
    "pHK4D8sOUJH2Dy1LhHqXC22ysxY2beQtz9qMqUMk",
    "ta9pAymPeHmvevHIQw7Ar9lzZMWfABcilbRkQQ1r",
    "eMG1vDsvdcmvQDWkhhwzD3xK9TFTFOLQ6WEjTVWz",
    "t00MDcbNXjfAkj0raXxNvu5zvDiH0MPwFhcQ4UJJ",
    "KWrFC8iepNoEQt3oFUx7Z9kJjILHNVIw0SNwX7mF",
    "ParszWcvU6EWssNvLmauPMCmUq0vgxAxoqVmdRee",
    "ErA3w4gURGe7xrNccNLOsz7fpF3OQtTCHMVREDZl",
    "hw66NinXJwyXSWtTL3UAvslFPojlNla9TkuntAyT",
    "zOxVZk36Fqvxh2tGJi8TbgeKVEzQi5YMoE5sEV2s",
    "SQV5PgR1Z7moUj205OdiCWG6wEcP84G7EipIHRbb",
    "uuXWZ7S02SSt0egSNhKOvHinxgV4DH9yfSLnjr2n",
    "VFIvRYKJ6CgodgQbt257J97tqV4otS6iMxUACId4",
    "mJpTqmmHEb14HkgG6lV3xXGic9gjzhprb7UUzjIs",
    "9c0BD3noXw32HQcUT2aTzxIdcD29VtRvoj9OHQNW",
    "CaEvCNDqC7LFUyARsIfzcgilck2Q9AJ7PycgZeCM",
    "qnQL6Q5Y020Kwnxve9eIXTTalzsoLvBr0U9aOhSC",
    "ZsvefGSyY1v8eLV2xbGqrxXFLLv3GlA1GbTlFuHe",
    "Zd6Cf9hcXblcniMwv6MNRD6jVGuYAEVPHyPbY1VP",
    "it0vtASSLul2zfTkG7mTJt7bau532bPL66v1hKUk",
    "MMSudIt9iu9GXzKh1DMK6RYBOJboHAlVnbxLEcG9",
    "wVQVCCSh5BVIm4AHr6DqEA1gdC3UY9A9R5sshdTV",
    "fa2KBVLIQ0drDqLbWLh65vEGdGFpPIj0NXyrW0rI",
    "m6d209jrGcuPLqLcb8yABY8PQTjr34SM6093Ujzi",
    "BL2N6NSh11jnPovS3lDj21o36G9xU5zdbjVO7gpb",
    "eswOyQyXokHMJTotRPRykeFhzklMIqYzZQV33K35",
    "oyZNsfc6x5DlHKOIRvkE8b4pctSww0o0TneEjQLn",
    "cFBLCzzyUyG8061RxCPFpV56EAXkWJg1oW2NSeIx",
    "eWXfiVHbG3HTgJtpDDnZHZ6X9IgM31eQsdLt9yzL",
    "dAesZveFpZW2xXV46KY6tos9M5iJ6mUUu9ofgEFE",
    "aSyVpeJau7Ix8gHS5r8T0oy6ySIFHKyc7Rnd2uQM",
    "YhJJLVTBao0UIldoTsK0pYh7MdJmSmJgMGlsOM6Q",
    "JTqMRpSbckxWITKTdfH2q83qj804Wnj6Mg4IWKbi",
    "0HXyc0paef3O2bHJFhUdczXxUYthqrI8T4jIs9vF",
    "twhqMBX8KqRRcZAOop4FltrmGd4VtypmN3qc2Cnw",
    "KiTPcaG9UOkdKjz8WGKb16d2ZOUcMqpMMJLOCEDZ",
    "G3QtyVTPj8IhoS1SX4EKazshmR4s0o8orKHcmyJR",
    "D3gHZKkh17FH0FUF5DW51nIQ44iAgPw6qIORBDGL",
    "uaIFb3bILrIgUCNnibjhigu1sxrTzWmwLGtK6uZM",
    "3T2pN2L76qndpqI67SWJ3aLKhoMzuZkvmAntTQxe",
    "mIntzvcfGcVRRSMjgDeaYuNMqswgOwLbEEkWBHpY",
    "23JBWdKZGYVvUuhwpEky7YKXMRBHc4SG1t7fqrJj",
    "1NguBDWkfphd8IFsIf1xGXNsuRKA1rV7RfSLkUPr",
    "VnoM2DT5oS5ARdNJ1ew28W8oXksZAXvL3IsrGTPF",
    "2GRepfkJvJWP4oR5Hh8w75LVTO2NXFETlhq1OG0V",
    "EOCgYrNZtljXxWhx44BLW8AT3OPN7ZEHQhiiZmNE",
    "tkOpEo9YCsDU00KIyv8kmmAtBeOlin4VvNkP5UxB",
    "jUIQM56ZeKziMWdUgb0Koj5oxNh7MbqM6fKXXY2l",
    "x9WMjPZrJhiSaiN7brBRn9UStpP8GvNsJs60uaUY",
    "Zm601jSgF8AxnRQkBS4kuurtKpcMHoOjHmvwqwSy",
    "FCNVWrfRrOndOyejRUc9rauP3dgMesDQPIpjag11",
    "RvY5QgdaxA1Mz3rNxljz4f2gAp8dGkWHkaJOsVaX",
    "mdKONcBcb7ExnSJKKXjeDoiFWj8pijH86HolZgvK",
    "07tnjLGQ3bMY4BO8rwMmqvI0fbFCMLdAxKihm2Jm",
    "HyCxKbPSeDrwXJ2pdeBwTO1ATotaj2JamEorFNrR",
    "pj7kfzKcQXI9iSOGNczyIgGSLOcYsrw6Z2dW08Gv",
    "K6NkXgVCltVOTCdRlgLLy4Una9du9W6D3r5p3Rfe",
    "mQsNfi6ePYEeAS71gWM75fnIcHZ0aST7jkW55aTu",
    "qlLLtGSWu8OmYtxGTeskhlraE0Fy3OQjAFOgQNDi",
    "B3D7JhTZW06D36pg5e3mKQYVpNDhUo1KsIsPeKIr",
    "kDIz2ZtJ8RtVkhPMu37Y7hLTBDgpP03VAAG3oI7M",
    "MLtIgvPjtmLY4p7J9EPdqRJbGAltozlkHH4aPaLU",
    "APJGUUMNaEIMY5imQ789ycDAvEm7iUJEAXRtgRPW",
    "thfkMaSzGSCJqhVekp5DZrTvJG9YnfFeWu9ncZGY",
    "ha3YeowzDes61WQe3lVCbBR2H62ZIRl907pvH1Rq",
    "htnMiKgh6Mp8Jcy5kjwnuIK2rD5COQFIKHBOzvEi",
    "ua9FZdwKOvqd1OvDnuhlOVEU1pbQP6nNLZmE84wD",
    "V0Dc8kaXoeFsWGDl5zDvZjbCbg2ponZMGPAJS5EW",
    "r8JxdQ3oTySw2rAugR7QAliKPplZjdMS6cLpDhwi",
    "iezV7luyorhI99Uij1kBK0gy5DTUQ1fgRmvYZG7w",
    "L11Qod1GgF7kXaGr5VmhE5WzLUgxhugMvaeGZuSK",
    "DBnOxVmQvNVdFDJ6ctdLL6LZrBt1zwRdc2JFGrtd",
    "AeyPS478fJuJNcbDjfp3SJDpLGGQWa3Ya8EH3Kcp",
    "5PYCqyiHFbOziRBGZ6Sj0sJFlyL0hFZlkB5Sw1rF",
    "JKYHD2GXHDsxt9yGwvWrmpS798P0kokRRA2qorXl",
    "PJ6G9zGmOP8KJc5NqtmbuLuMjHLSoJltp01ca5Md",
    "0pSUnrOJ9UwawyGPGsR7ZkriLN8DFLRRCwQgTmsu",
    "21gJ3Ryq7vZz2xqKt21InAcDeam4Tvtyc5HzXyDJ",
    "7cPlUAa9w4iwDhEU03aBb35lnQY1tlVb9mYOBwan",
    "15ehsRBpBqQyBHLe2CZoZFW7mxJhXf6bXyU6TMlu",
    "Jd03tqag05ClpZ0r51XE2b0o6Da9Ir6QH9KTRkTD",
    "sBwzZcRyRYX1CINszqrwfbIeHUtcc3w1lyiXgQjk",
    "NdxDuZlhxi3241yMsD503U2e6ZE0etP5mJ8ssfnh",
    "0fOC4kFFzn935oBXt8YH9wZIg200sz5fD2R54t2c",
    "T6947T6oR3cGbtyuijtrcLzyTFFnNC16RPvkZ77o",
    "4tnzVJRk8ozy5RvHVMO5N2vila7XXi5ZBfKf1SeA",
    "e4DYP3hkSJrjwv0mv18F5MN9PKTB4vVQmxo4GqW9",
    "nqibn6C8U1tTGL3SpvQi9pKeJecAxNtuKMK3Gevr",
    "UqAK8clwNMjsBQcBkBqLbPqQumLTYQKZ4tMOksn2",
    "cYjkwg7V3uww3a6q6kTg93bqvjJe1cJRRdDeviqc",
    "U79I9AIsSUk1N1PPXT0OJq8VrjYREvV2nDtC1vBF",
    "cW2HbmrbRC0U09MgvDc5y3Ao4VjY7QtzdHUn8Is1",
    "cyevNG8NWeU6kNHjrRLd2v6nD1RpIXtji6tPzmGT",
    "qwE1Vo17A397BEo5gIvVIq0vSNbpWHqQnk04BZZU",
    "rPwUei33Dd5u5b3e8rhm1sxgx3VIMRbl56zPGIrC",
    "59IKP5CVb2VnYgLrgEvSiJg9i2JC0ajCB5oOXI7k",
    "Yn6H1BajU6cayU1ohfOzh4zkMGwGRvA4HhBfhQ4U",
    "EDCtJXbe9DMgBN7LYdbn3S0nzPXOf14m5qh0Wbl7",
    "tfWj4KnVqARlQnv8WWS2WTEAZvtT6s83GXrIrnV0",
    "7xwkdwh8Yc29Vi8wet8bMwz0FjH1R9TUMsGsLFdP",
    "o0TAX5V1PXIyHGHiC3NiaO5T1PEO7yzfpsA5tiPd",
    "fGHpGt1547qZQvuWgNkwOMP5Rb6pIXcyBvAoK5pz",
    "GjB44ckAj8Zs0ecgY0sqxH5d5aAUVjIR8cQVwVEu",
    "Borr0CGiOuysRergvndAblVmsOcsnFlGJM4FtWDo",
    "fggdVJlulMwBxDWtOFztZA2zRUAnH1VY8zDXxxx9",
    "ix8trHnciJWvuq0xvg7yqEDwK5pNJYBt0CtpsvqE",
    "N3n7wtazOFvcqYz38cz3iRo5EI79TZLz2SffAXrp",
    "p45R1x1wYL1OqCeKtms3rxnvDadHLBaveuLXAP4v",
    "ZWJFtjZrVaXUJpSkEJxJbta7s3lcSaIpQDIFrPsU",
    "q1zyNIBITxuXXDwP8Uafh7FyVZWctG592hFQaDKF",
    "oToBUb0llmYvgU6aWu2M3XuB05ynvYwYAZsg57nO",
    "QBIPskICHcRgvM9CuPd6grEVsFK5z5YuLJ9vkdbO",
    "OO5QeUlk85rZfgxhN8ATjr4h0lsefC3ztJnsllvI",
    "yj8GZF6HkPTKaymx6ggo62w9QfaCErHhcKt83iQA",
    "WfCJCgwCnxBU4Gbzb8KPLwld0b2UTbZ0TgA3jhnj",
    "LQNwvKoVR6npd98ZKDYpTRfmpivHushqxKxjeaiO",
    "Z00jaWfUCFw8tuyqRi17RxWgUkuKIkWMjQ8aRTAj",
    "rC6gzfi425Af4xk6LEC6L4X8SDZRkGPNThRVM07u",
    "BKZhhfbetTMv93lJ8fszVkxMEm6Nf5l6OqUQSnbn",
    "sKbjrTc0T04Z7Zmm68zpQ0orVLNrabAFs3AF8dHv",
    "spdtw9kb3qo6dJUEsujzXw8j8h365jzsfaP79jjV",
    "ZamtzXcrkS3fNmRM5aLeoz8mjtqQGGBYZ39AIGFl",
    "NqHBD3fYHU1RnfjtQyVAl72KNTzfQmEMeFwUgWg8",
    "tpX541YSv38YdjXLtiIDnFK3MfVvRGdUtyvLXK6X",
    "M0EFLo0SCKCcBHr7DHYHt0YbIkOiK2N8l24z5yoD",
    "lOXpPY9WVAHyBOzJKzMKg1NDLUDho6fTRmwKlasQ",
    "iiUafg5me3NIXR56cTO4wTE2YHG02lKB2eBoHwr3",
    "YHFwS0yW1bhrCBTDX1zi5RAAGfGhLtrzfoljxAa9",
    "SOLxOO4Fu0DDlgscrGvXn0WxUHSLzayW5w7uYeok",
    "KMlGvhEoYA6KZ843Do5R8FFN4FCIYEvWlyRoYuoX",
    "Jde92Mb7kCQdBLNnrQZCchaaKsRIMkhB6Kjl96ha",
    "bDSM4FFqD0FuTQC7GzNUL4dURo2MO3QxClt1HXCT",
    "7ujF7TsIU90SFbP0zLkSs6HmiDJ6xA83x6HgpOlY",
    "HGgdvkY28rkabVaBC76infX97TV5XY9XP1xccyq9",
    "mR30V5nasv5X5EGXhUdMKYZM5veGkTSOUp4YHt9u",
    "JH4Ywt1OPSLyGHtHXuWOQtVKJU597jhcaoSOUNao",
    "4HkBCTBqDISWTqXTA8Yrb2z9239I9vzlpDqVAD39",
    "qT8ZjgzL8lmXVcGvVkdLVpDZoCNC4AWfVsYQgnkk",
    "pyUnxwRsXPe0mxovGiCGcABiNWzoEwdwrFE1msPN",
    "o5b4ju4BUEeGCA0JnDnuV2Nql6eJpkr4kgbyRKbJ",
    "V6p7izmeOFCCe9U4rRScayBoKNCP6d7kiqMw6dzu",
    "bc5TiA5zB2BFap2mfJ27vpvkF1GgwSsqsWroVON8",
    "cMUJJGTPoKOJcDDBmdf4w8hPUvypX5ueZk7UGWCo",
    "hXMlUuioA2CDPx1xL4C7bESzPrQs5msdjwCePop6",
    "LmnOEPtOhlOODGuxUkPGQQHm3SmdCXkHeETPSZw0",
    "tpVd3HY594qfndfy34boBkhidEPZ8JaIfsaSCcuG",
    "dYUNrF4cGTGorAqQybXUZp5GRoLVbJvjPden2cmt",
    "3bxbA5wRxpt8Ri5T2PtJQ7OA3nNCNnzSIeBllpSc",
    "3DTIoh5d3mNXUDXV4hRjoUD4DORv4pWYOGFiLxuk",
    "JTd1lMuf74jjDk0SuGag5voFhjIpVZM08zifnlc1",
    "S6t8rbLlh5Fjq6n44bilqar86SVDGQTk6LG37d9F",
    "TkISmG1VCPuxIng3tAMeUV9i2xzVPDtn2TPUPzY9",
    "hUl4qHa1S4EvcHV602PIKJcUBImbfiSu6rIkECny",
    "lOamDQdGsaDuoC1BcZn3ZcFt8DTOGuFFIMuGuVG4",
    "5Qw6lsvPjPsrw4YSKKofnDFOao6i7iU1O7KUTgeA",
    "g8hw4gahtqHKfUmifFKGtO1eVArZ5rnef0i4qlMh",
    "Ts18kbeS4ZobJIsCxpfkFy9kOpDjpTrMArY923sV",
    "TCdzQrfztYqHfdj4jHAkJuG3tFRurqz81VM8Feu5",
    "sGWk841B3F2Nk9QdBBv8xN88nlFsKjQup5SwusvR",
    "2bhUZ84xQziYIefq3fqsRC38KaGkrn9uHo8Lnw7y",
    "wZDd3M64qVHLR8y3JviqyjaA2c8y1sFCpXuVyqS0",
    "stlrvvCkJifoKmyw6llnhreSi5vIK8uA637XeaX8",
    "v9D704MIOm48aDFPILYBNELgtG8JNKlWGZSv6nPM",
    "NYsaRxqx3e6RsigC6Dvw5pmyxWNq0ts0Zzj8hjk3",
    "KXe5OsOY8AAqr4VZ7Ek9EvMf47e1P5CB3wDBKwSY",
    "5L4zX7jQgIZW5aJq22rfq59tRdHmZKcioMXa1EbE",
    "9uUhpVCgMb42by3QbMTe3CVKdkBFQBw7O7A321oN",
    "Mz7Xhokb1cD2jAgZufKSPLEutxtHJSVnd3HaAvDc",
    "Rzl5vTtr9Eb5HSfGwqDUXpiE7bSEjTt32haFWpKe",
    "sDUlQfPa72ikihGQz4yVpu8kl0RV11bZJq0mwTNI",
    "2mXnnflxnUVDQGKxSZjm1j3Ppps7FHfrguLIDp4w",
    "xgsuolqT42kBpgAxFxm23fBG4VhwS8GKFwDe3W9r",
    "nrQ03hInUCqgtkfpjKtovRvgfu7dWKTmui8TAqSZ",
    "VbCBnQ7l1Mm53S97TSoCRl95x3TlJDLrzObpvoRg",
    "8wdINef6S4hRIoViUb2qmO7h2Xw4Uyi2TggeIWsK",
    "gGjZ7FNgY5kx04mlgAiH17gGh0RygFXspaQz6PwS",
    "AC2glFP9EZsEgJYc9VWHQIjoQzM7P1Svy7AbZHJ3",
    "ZY3fppXFWFHnILvn9j6Yce2J1PX4CLFaUPTyBohL",
    "WxKXDOnnnaitPGABzpKOzgVvkkaxPmBbtlMvlGGC",
    "op3Vo3HUaKw3lV1gSetHs4MVlnwTrorn8iwioK7I",
    "exFwQxvPGHHVlpPXglp28Yt1NFsD1WSD0frFvuFt",
    "BSDEzwNHBU1cjhNUmlnBA48TRHMigtNY6hGkTJvc",
    "P3ZIURPBWfgGmWKQoxl17KG5koBDXF3TErS8FMs5",
    "mmja9p6saCDHG3kgDAQX40zBFoR2oNXiDf9BraxL",
];
const ISSUABLE = VAULT.slice(1);

const DB_PATH = path.join(path.dirname(process.pkg ? process.execPath : __filename), 'keys.json');
function loadDB() {
    if (!existsSync(DB_PATH)) return { issued: {}, nextIndex: 0 };
    try { return JSON.parse(readFileSync(DB_PATH, 'utf8')); }
    catch { return { issued: {}, nextIndex: 0 }; }
}
function saveDB(db) { writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8'); }

function claimKey(userId) {
    const db = loadDB();
    if (db.issued[userId]) return { key: db.issued[userId], fresh: false, n: ISSUABLE.indexOf(db.issued[userId]) + 1 };
    if (db.nextIndex >= ISSUABLE.length) return null;
    const n = db.nextIndex + 1;
    const key = ISSUABLE[db.nextIndex++];
    db.issued[userId] = key;
    saveDB(db);
    return { key, fresh: true, n };
}

// ── Colors ────────────────────────────────────────────────────────────────────
const C_MAIN = 0x5865F2;
const C_OK   = 0x57F287;
const C_WARN = 0xFEE75C;
const C_ERR  = 0xED4245;
const C_DIM  = 0x2B2D31;
const EPHEMERAL = MessageFlags.Ephemeral;

// ── Embeds ────────────────────────────────────────────────────────────────────

// Verification channel embed — first thing new members see
function verifyEmbed() {
    return new EmbedBuilder()
        .setColor(C_MAIN)
        .setTitle('INTERNAL')
        .setDescription(
            '```\nprivate  ·  invite only\n```\n' +
            '> This server is restricted to verified members.\n\n' +
            'Press **Verify** to confirm you are human and gain access to all channels.\n' +
            '-# No captcha, no DM — one click.')
        .setFooter({ text: 'INTERNAL  ·  private' });
}

function verifyRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('verify')
            .setLabel('Verify')
            .setStyle(ButtonStyle.Secondary)
    );
}

// Key channel embed
function mainEmbed() {
    return new EmbedBuilder()
        .setColor(C_MAIN)
        .setTitle('INTERNAL  ·  access')
        .setDescription(
            '```\nprivate  ·  key-gated\n```\n' +
            '> Automated Discord client setup — Vencord build.\n' +
            '> One key per user, single activation.\n\n' +
            'Press **Get Key** below to claim yours.\n' +
            '-# Key is sent only to you.')
        .setFooter({ text: 'INTERNAL  ·  private' })
        .setTimestamp();
}

function keyRow() {
    return new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('get_key')
            .setLabel('Get Key')
            .setStyle(ButtonStyle.Secondary)
    );
}

// ── FIX: kDownloadUrl was never declared → ReferenceError → "Something broke"
// Key is now shown directly in the embed, no download link.
function replyKey(key, fresh, granted) {
    const e = new EmbedBuilder()
        .setColor(fresh ? C_OK : C_WARN)
        .setTitle(fresh ? 'key issued' : 'key retrieved')
        .setDescription(
            (fresh
                ? 'Your activation key:\n'
                : 'You already have a key — here it is again:\n') +
            '```\n' + key + '\n```')
        .addFields({ name: 'usage', value: 'Run **INTERNAL.exe** and paste the key when prompted. Activates once.' })
        .setFooter({ text: fresh ? 'Save it — press Get Key again any time to retrieve it.' : 'Already assigned to you.' });
    if (granted) {
        e.addFields({ name: 'access granted', value: 'Member role applied — community channels are now visible.' });
    }
    return { embeds: [e] };
}

// ── Texts ─────────────────────────────────────────────────────────────────────
const TXT = {
    welcome: () => ({
        embeds: [new EmbedBuilder()
            .setColor(C_MAIN)
            .setTitle('Welcome to INTERNAL')
            .setDescription(
                'Private community around the **INTERNAL** build — automated Discord client setup.\n\n' +
                '**Getting started**\n' +
                '`1` Read <#RULES> and follow them.\n' +
                '`2` Open <#ACCESS> and press **Get Key**.\n' +
                '`3` Run **INTERNAL.exe** and paste the key when prompted.\n\n' +
                '-# Questions? Check <#FAQ> first, then ask in support.')
            .setFooter({ text: 'INTERNAL  ·  private' })],
        components: [],
    }),

    rules: () => ({
        embeds: [new EmbedBuilder()
            .setColor(C_WARN)
            .setTitle('Rules')
            .setDescription('By staying here you agree to the following.')
            .addFields(
                { name: '1 · Respect',           value: 'No harassment, hate speech, threats, or personal attacks.' },
                { name: '2 · No spam or ads',    value: 'No flooding, mass pings, self-promo, or server invites.' },
                { name: '3 · Keys are personal', value: 'One key per user. Do not share, trade, sell, or post your key.' },
                { name: '4 · Right channel',     value: 'Help → support. Chat → general. Memes → off-topic.' },
                { name: '5 · Legal',             value: 'No NSFW, no illegal content, no doxxing.' },
                { name: '6 · No impersonation',  value: 'Do not pretend to be staff. Staff will never ask for your token.' },
                { name: '7 · Discord ToS',       value: 'Discord Terms of Service and Community Guidelines apply here.' },
                { name: '8 · Staff decisions',   value: 'Staff have the final say. DM an Admin if you think a call was wrong.' },
            )
            .setFooter({ text: 'Breaking rules → warning, mute, kick, or ban.' })],
        components: [],
    }),

    faq: () => ({
        embeds: [new EmbedBuilder()
            .setColor(C_MAIN)
            .setTitle('FAQ')
            .addFields(
                { name: 'How do I get a key?',        value: 'Open <#ACCESS> and press **Get Key**. The key is shown only to you.' },
                { name: 'Where do I use the key?',    value: 'Run **INTERNAL.exe** and paste it when prompted. Activates once.' },
                { name: 'I lost my key.',             value: 'Press **Get Key** again — you get the same key back. You can never get a second one.' },
                { name: 'The bot says no keys left.', value: 'The current batch is used up. Contact the owner.' },
                { name: 'Key does not work.',         value: 'Post in support — what you did, what error you saw. Never post the key itself.' },
                { name: 'Can I share my key?',        value: 'No. See rule 3.' },
            )
            .setFooter({ text: 'INTERNAL  ·  FAQ' })],
        components: [],
    }),

    support: () => ({
        embeds: [new EmbedBuilder()
            .setColor(C_DIM)
            .setTitle('Support')
            .setDescription(
                'Before posting, check <#FAQ>.\n\n' +
                '**A good help request includes:**\n' +
                '· what you tried, step by step\n' +
                '· the exact error text or a screenshot\n' +
                '· your Windows version\n\n' +
                '**Never post your key or any account tokens.**\n' +
                '-# One problem per message. No staff pings.')],
        components: [],
    }),

    staff: () => ({
        embeds: [new EmbedBuilder()
            .setColor(C_DIM)
            .setTitle('Staff guide')
            .setDescription(
                '**Commands** (Admin only)\n' +
                '`/setup` — create/repair roles, channels, permissions, re-post info messages\n' +
                '`/post [channel]` — post an extra Get Key embed\n\n' +
                '**Key log** — every issued key is logged in <#LOGS> as `key #N → user`. The key itself is never logged.\n\n' +
                '**Roles**\n' +
                '`Owner` / `Admin` — full control\n' +
                '`Moderator` — manage messages, kick, timeout, voice moderation\n' +
                '`Member` — normal user, granted on **Verify** and **Get Key**\n\n' +
                '-# Keys live in keys.json next to the bot. Back it up.')],
        components: [],
    }),
};

function fillMentions(payload, ids) {
    const map = { RULES: ids.rules, ACCESS: ids.access, FAQ: ids.faq, LOGS: ids.logs };
    const swap = s => s?.replace(/<#([A-Z]+)>/g, (m, k) => map[k] ? `<#${map[k]}>` : `#${k.toLowerCase()}`);
    return {
        ...payload,
        embeds: payload.embeds.map(e => {
            const d = e.toJSON();
            d.description = swap(d.description);
            d.fields = d.fields?.map(f => ({ ...f, value: swap(f.value) }));
            return new EmbedBuilder(d);
        }),
    };
}

// ── Permissions ───────────────────────────────────────────────────────────────
const bits = (...f) => f.reduce((a, b) => a | b, 0n);
const READ       = [P.ViewChannel, P.ReadMessageHistory];
const POST       = [P.SendMessages, P.SendMessagesInThreads, P.EmbedLinks, P.AttachFiles, P.AddReactions, P.UseExternalEmojis];
const NO_MSG     = [...POST, P.CreatePublicThreads, P.CreatePrivateThreads];
const VOICE      = [P.ViewChannel, P.Connect, P.Speak, P.UseVAD, P.Stream];
const MEMBER_BASE = [...READ, ...POST, P.UseApplicationCommands, P.Connect, P.Speak, P.UseVAD, P.Stream, P.ChangeNickname];
const MOD_EXTRA   = [P.ManageMessages, P.ManageThreads, P.KickMembers, P.ModerateMembers, P.MuteMembers,
                     P.DeafenMembers, P.MoveMembers, P.ManageNicknames, P.ViewAuditLog];

const ROLE_DEFS = [
    { name: 'Owner',     color: 0x5865F2, hoist: true,  perms: bits(P.Administrator) },
    { name: 'Admin',     color: 0x7289DA, hoist: true,  perms: bits(P.Administrator) },
    { name: 'Moderator', color: 0xEB459E, hoist: true,  perms: bits(...MEMBER_BASE, ...MOD_EXTRA) },
    { name: 'Member',    color: 0x57F287, hoist: false, perms: bits(...MEMBER_BASE) },
];

// access types:
//   verify — @everyone can see it, Member CANNOT (channel disappears after they verify)
//   info   — Member+ reads, no posting
//   member — Member+ reads + posts
//   staff  — Moderator+ only
const LAYOUT = [
    { name: '·', access: 'verify', channels: [
        // Name with space so Discord shows it nicely; isVerify triggers the button embed
        { name: 'verify', topic: 'Press Verify to access the server.', isVerify: true },
    ]},
    { name: 'INFORMATION', access: 'info', channels: [
        { name: 'welcome',       topic: 'Start here.',                              post: 'welcome' },
        { name: 'rules',         topic: 'Read before doing anything else.',         post: 'rules' },
        { name: 'announcements', topic: 'Updates and news.' },
        { name: 'faq',           topic: 'Answers to the usual questions.',          post: 'faq' },
        { name: 'get-access',    topic: 'Press Get Key to claim your key.',         isKey: true },
    ]},
    { name: 'COMMUNITY', access: 'member', channels: [
        { name: 'general',     topic: 'Main chat.' },
        { name: 'off-topic',   topic: 'Everything else.' },
        { name: 'support',     topic: 'Need help? Read the pinned message first.',  post: 'support' },
        { name: 'suggestions', topic: 'Ideas and feedback.' },
        { name: 'Lounge',      voice: true },
    ]},
    { name: 'STAFF', access: 'staff', channels: [
        { name: 'admin-chat', topic: 'Staff only.',                                post: 'staff' },
        { name: 'bot-logs',   topic: 'Key claims and bot activity.',               isLogs: true },
        { name: 'Staff Room', voice: true },
    ]},
];

function permsFor(access, voice, R, botId) {
    const ev  = R.everyone;
    const o   = (id, type, allow = [], deny = []) => ({ id, type, allow, deny });
    const role = (r, allow, deny) => o(r.id, OverwriteType.Role, allow, deny);
    const bot  = o(botId, OverwriteType.Member, [
        P.ViewChannel, P.SendMessages, P.EmbedLinks,
        P.ReadMessageHistory, P.ManageMessages, P.ManageChannels,
    ]);

    if (access === 'verify') {
        // @everyone can see, Member cannot (it disappears after they press Verify)
        return [
            role(ev,          READ,            NO_MSG),
            role(R.Member,    [],              [P.ViewChannel]),
            role(R.Moderator, [...READ, ...POST], []),
            bot,
        ];
    }
    if (access === 'info') {
        // Member+ can read, no one can post (read-only pinned info)
        return [
            role(ev,          [],  [P.ViewChannel]),
            role(R.Member,    READ, NO_MSG),
            role(R.Moderator, READ, NO_MSG),
            bot,
        ];
    }
    if (access === 'member') {
        const open = voice ? VOICE : [...READ, ...POST];
        return [
            role(ev,          [],   [P.ViewChannel]),
            role(R.Member,    open),
            role(R.Moderator, [...open, P.ManageMessages, P.MuteMembers, P.MoveMembers]),
            bot,
        ];
    }
    // staff
    const open = voice ? VOICE : [...READ, ...POST];
    return [
        role(ev,          [], [P.ViewChannel]),
        role(R.Member,    [], [P.ViewChannel]),
        role(R.Moderator, [...open, P.ManageMessages]),
        role(R.Admin,     open),
        role(R.Owner,     open),
        bot,
    ];
}

async function upsertBotMessage(ch, payload, pin) {
    const msgs = await ch.messages.fetch({ limit: 50 });
    const mine = [...msgs.values()]
        .filter(m => m.author.id === client.user.id)
        .sort((a, b) => a.createdTimestamp - b.createdTimestamp)[0];
    if (mine) { await mine.edit(payload); return 'updated'; }
    const m = await ch.send(payload);
    if (pin) { try { await m.pin(); } catch { /* no pin perms, not fatal */ } }
    return 'posted';
}

async function bootstrapServer(guild) {
    const log = [];
    const step = async (label, fn) => {
        try { const r = await fn(); log.push(`ok    ${label}${r ? ' (' + r + ')' : ''}`); return true; }
        catch (e) { log.push(`FAIL  ${label}: ${e.message}`); return false; }
    };

    await guild.roles.fetch();
    await guild.channels.fetch();

    // roles
    const R = {};
    for (const def of ROLE_DEFS) {
        let r = guild.roles.cache.find(x => x.name === def.name);
        if (r) {
            log.push(`ok    role ${def.name} (exists, left untouched)`);
        } else {
            await step(`role ${def.name}`, async () => {
                r = await guild.roles.create({ name: def.name, color: def.color, hoist: def.hoist, permissions: def.perms, reason: 'INTERNAL setup' });
                return 'created';
            });
        }
        R[def.name] = r;
    }
    R.everyone = guild.roles.everyone;
    if (ROLE_DEFS.some(d => !R[d.name])) {
        log.push('ABORT roles missing — give the bot Administrator and re-run /setup');
        return { log, ids: {} };
    }

    if (kHardenEveryone) {
        await step('@everyone base perms', async () => {
            await R.everyone.setPermissions(bits(...READ), 'INTERNAL setup');
            return 'View + Read History';
        });
    }

    // categories + channels
    const ids = {};
    const posts = [];
    for (const cat of LAYOUT) {
        let catCh = guild.channels.cache.find(c => c.type === ChannelType.GuildCategory && c.name === cat.name);
        const catPerms = permsFor(cat.access, false, R, client.user.id);
        await step(`category ${cat.name}`, async () => {
            if (catCh) { await catCh.permissionOverwrites.set(catPerms, 'INTERNAL setup'); return 'synced'; }
            catCh = await guild.channels.create({
                name: cat.name, type: ChannelType.GuildCategory,
                permissionOverwrites: catPerms, reason: 'INTERNAL setup',
            });
            return 'created';
        });
        if (!catCh) continue;

        for (const def of cat.channels) {
            const type = def.voice ? ChannelType.GuildVoice : ChannelType.GuildText;
            const norm = n => n.toLowerCase().replace(/\s+/g, '-');
            let ch = guild.channels.cache.find(c => c.type === type && c.parentId === catCh.id && norm(c.name) === norm(def.name))
                  ?? guild.channels.cache.find(c => c.type === type && !c.parentId && norm(c.name) === norm(def.name));
            const perms = permsFor(cat.access, !!def.voice, R, client.user.id);
            await step(`#${def.name}`, async () => {
                if (ch) {
                    await ch.edit({ parent: catCh.id, permissionOverwrites: perms, ...(def.topic ? { topic: def.topic } : {}), reason: 'INTERNAL setup' });
                    return 'synced';
                }
                ch = await guild.channels.create({
                    name: def.name, type, parent: catCh.id, permissionOverwrites: perms,
                    ...(def.topic ? { topic: def.topic } : {}), reason: 'INTERNAL setup',
                });
                return 'created';
            });
            if (!ch) continue;
            if (def.isVerify) ids.verify = ch.id;
            if (def.isKey)    ids.access = ch.id;
            if (def.isLogs)   ids.logs   = ch.id;
            if (def.name === 'rules') ids.rules = ch.id;
            if (def.name === 'faq')   ids.faq   = ch.id;
            if (def.post) posts.push({ ch, key: def.post, name: def.name });
        }
    }

    // text messages
    for (const p of posts) {
        await step(`message in #${p.name}`, async () => upsertBotMessage(p.ch, fillMentions(TXT[p.key](), ids), true));
    }
    // verify embed
    if (ids.verify) {
        const ch = guild.channels.cache.get(ids.verify);
        await step('verify embed in #verify', async () =>
            upsertBotMessage(ch, { embeds: [verifyEmbed()], components: [verifyRow()] }, true));
    }
    // key embed
    if (ids.access) {
        const ch = guild.channels.cache.get(ids.access);
        await step('key embed in #get-access', async () =>
            upsertBotMessage(ch, { embeds: [mainEmbed()], components: [keyRow()] }, true));
    }
    return { log, ids };
}

// ── Runtime ───────────────────────────────────────────────────────────────────
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async () => {
    console.log(`[INTERNAL] online as ${client.user.tag}`);
    try {
        await deployCommands();
    } catch (e) {
        console.error('[deploy error]', e.message);
        console.error('[deploy error] Make sure CLIENT_ID and GUILD_ID in .env are correct.');
    }
});

client.on(Events.Error, e => console.error('[client]', e));
process.on('unhandledRejection', e => console.error('[unhandled]', e));

client.on(Events.InteractionCreate, async interaction => {
    try {
        // ── Slash commands ────────────────────────────────────────────────────
        if (interaction.isChatInputCommand()) {
            if (!interaction.inGuild())
                return interaction.reply({ content: 'Server only.', flags: EPHEMERAL });
            const isAdmin = interaction.memberPermissions?.has(P.Administrator);

            if (interaction.commandName === 'setup') {
                if (!isAdmin)
                    return interaction.reply({ content: 'Admins only.', flags: EPHEMERAL });
                await interaction.deferReply({ flags: EPHEMERAL });
                const { log, ids } = await bootstrapServer(interaction.guild);
                const failed = log.filter(l => l.startsWith('FAIL') || l.startsWith('ABORT')).length;
                let body = log.join('\n');
                if (body.length > 3800) body = body.slice(0, 3800) + '\n…';
                return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(failed ? C_WARN : C_OK)
                        .setTitle(failed ? `Setup finished with ${failed} problem(s)` : 'Setup complete')
                        .setDescription('```\n' + body + '\n```')
                        .addFields({ name: 'Key embed', value: ids.access ? `<#${ids.access}>` : 'not posted' })
                        .setFooter({ text: failed ? 'Bot needs Administrator + its role above the roles it manages.' : 'Safe to re-run any time.' })],
                });
            }

            if (interaction.commandName === 'post') {
                if (!isAdmin)
                    return interaction.reply({ content: 'Admins only.', flags: EPHEMERAL });
                const ch = interaction.options.getChannel('channel') ?? interaction.channel;
                await ch.send({ embeds: [mainEmbed()], components: [keyRow()] });
                return interaction.reply({ content: `Posted in <#${ch.id}>`, flags: EPHEMERAL });
            }
        }

        // ── Verify button — grants Member, hides #verify from the user ────────
        if (interaction.isButton() && interaction.customId === 'verify') {
            await interaction.deferReply({ flags: EPHEMERAL });

            if (!interaction.inGuild()) {
                return interaction.editReply({ content: 'Server only.' });
            }

            const memberRole = interaction.guild.roles.cache.find(r => r.name === 'Member');
            if (!memberRole) {
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setColor(C_ERR)
                        .setTitle('Setup needed')
                        .setDescription('Member role not found. Ask an admin to run `/setup`.')],
                });
            }

            let alreadyVerified = false;
            if (interaction.member.roles.cache.has(memberRole.id)) {
                alreadyVerified = true;
            } else {
                await interaction.member.roles.add(memberRole, 'INTERNAL verification');
            }

            return interaction.editReply({
                embeds: [new EmbedBuilder()
                    .setColor(alreadyVerified ? C_WARN : C_OK)
                    .setTitle(alreadyVerified ? 'already verified' : 'verified')
                    .setDescription(alreadyVerified
                        ? 'You are already a member. All channels should be visible.'
                        : 'Access granted. All channels are now visible.\n-# This channel is now hidden from your view.')
                    .setFooter({ text: 'INTERNAL  ·  private' })],
            });
        }

        // ── Get Key button ────────────────────────────────────────────────────
        if (interaction.isButton() && interaction.customId === 'get_key') {
            await interaction.deferReply({ flags: EPHEMERAL });

            const result = claimKey(interaction.user.id);
            if (!result) {
                return interaction.editReply({
                    embeds: [new EmbedBuilder().setColor(C_ERR)
                        .setTitle('no keys left')
                        .setDescription('The current batch is exhausted. Contact the owner.')],
                });
            }

            let granted = false;
            if (kGrantOnKey && interaction.inGuild()) {
                const memberRole = interaction.guild.roles.cache.find(r => r.name === 'Member');
                if (memberRole && interaction.member && !interaction.member.roles.cache.has(memberRole.id)) {
                    try { await interaction.member.roles.add(memberRole, 'INTERNAL key claimed'); granted = true; }
                    catch (e) { console.error('[role]', e.message); }
                }
            }

            if (kLogKeyClaims && result.fresh && interaction.inGuild()) {
                const logCh = interaction.guild.channels.cache
                    .find(c => c.type === ChannelType.GuildText && c.name === 'bot-logs');
                logCh?.send({ embeds: [new EmbedBuilder().setColor(C_DIM)
                    .setDescription(`key **#${result.n}** → <@${interaction.user.id}> (\`${interaction.user.tag}\`)`)
                    .setTimestamp()] }).catch(() => {});
            }

            return interaction.editReply(replyKey(result.key, result.fresh, granted));
        }

    } catch (e) {
        console.error('[interaction]', e);
        const msg = { content: 'Something broke on my side. Try again in a moment.', flags: EPHEMERAL };
        try {
            interaction.deferred || interaction.replied
                ? await interaction.followUp(msg)
                : await interaction.reply(msg);
        } catch { /* gone */ }
    }
});

client.login(TOKEN);
