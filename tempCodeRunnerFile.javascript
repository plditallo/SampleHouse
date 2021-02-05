const obj = {
    name: { S: 'SH_RaPiano_01_F#m_75_MIDI.midi.mid' },
    exclusive: { BOOL: false },
    instrument_type: { SS: [ 'piano' ] },
    pack: { S: 'SH Radio Piano' },
    s3_uri: {
      S: 's3://samplehouse/packs/SH Radio Piano/SH_RaPiano_01_F#m_75_MIDI.midi.mid'
    }
  }

  console.log(obj.exclusive.BOOL)