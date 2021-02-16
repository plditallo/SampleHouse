exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('Sound').del()
    .then(function () {
      // Inserts seed entries
      return knex('Sound').insert([{
          s3_uri: "s3://samplehouse/packs/SH Essential Drums/SH_Essential_Hat_01.wav",
          name: "SH_Essential_Hat_01.wav",
          exclusive: true,
          type: "one shot",
          pack: "SH Essential Drums",
        },
        {
          name: "SH_Essential_Hat_02.wav",
          exclusive: false,
          type: "one shot",
          pack: "SH Essential Drums",
          s3_uri: "s3://samplehouse/packs/SH Essential Drums/SH_Essential_Hat_02.wav"
        },
        {
          name: "SH_Essential_Hat_03.wav",
          exclusive: false,
          type: "one shot",
          pack: "SH Essential Drums",
          s3_uri: "s3://samplehouse/packs/SH Essential Drums/SH_Essential_Hat_03.wav",
        },
        {
          name: "SH_RaPiano_01_F#m_75_MIDI.midi.mid",
          exclusive: false,
          pack: "SH Radio Piano",
          s3_uri: "s3://samplehouse/packs/SH Radio Piano/SH_RaPiano_01_F#m_75_MIDI.midi.mid"
        },
        {
          name: "SH_RaPiano_02_Ebm_85_MIDI.midi.mid",
          exclusive: true,
          pack: "SH Radio Piano",
          s3_uri: "s3://samplehouse/packs/SH Radio Piano/SH_RaPiano_02_Ebm_85_MIDI.midi.mid"
        },
        {
          // id: 6,
          s3_uri: "s3://samplehouse/packs/SH Tropical Storm/SH_TropS_Instru_01_D_100.wav",
          name: "SH_TropS_Instru_01_D_100.wav",
          exclusive: false,
          tempo: 100,
          type: "loop",
          pack: "SH Tropical Storm",
          key: "d"
        },
        {
          // 7
          duration: 9,
          s3_uri: "s3://samplehouse/packs/SH Tropical Storm/SH_TropS_Instru_02_Am_105.wav",
          name: "SH_TropS_Instru_02_Am_105.wav",
          exclusive: true,
          tempo: 105,
          type: "loop",
          pack: "SH Tropical Storm",
          key: "am",
        },
        {
          // 8
          name: "SH_TropS_Instru_04_Db_95.wav",
          exclusive: false,
          type: "loop",
          pack: "SH Tropical Storm",
          s3_uri: "s3://samplehouse/packs/SH Tropical Storm/SH_TropS_Instru_04_Db_95.wav",
        },
        {
          //9
          duration: 12,
          s3_uri: "s3://samplehouse/packs/SH Exotic Flutes/SH_ExoFlute_BrokenWedding_Dm_75.wav",
          name: "SH_ExoFlute_BrokenWedding_Dm_75.wav",
          exclusive: false,
          tempo: 75,
          type: "loop",
          pack: "SH Exotic Flutes",
          key: "dm",
        },
        {
          //10
          duration: 12,
          s3_uri: "s3://samplehouse/packs/SH Exotic Flutes/SH_ExoFlute_CallingHours_Gm_75.wav",
          name: "SH_ExoFlute_CallingHours_Gm_75.wav",
          exclusive: false,
          tempo: 75,
          type: "loop",
          pack: "SH Exotic Flutes",
          key: "gm",
        },
        {
          name: "SH_ExoFlute_DesertedIsland_F#m_80.wav",
          exclusive: false,
          type: "loop",
          pack: "SH Exotic Flutes",
          s3_uri: "s3://samplehouse/packs/SH Exotic Flutes/SH_ExoFlute_DesertedIsland_F#m_80.wav",
        }
      ]);
    });
};
